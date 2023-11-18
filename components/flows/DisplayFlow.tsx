import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

import { useQuery, gql } from '@apollo/client';
import client from '../../apollo/apollo'; // Adjust the import path accordingly
import React, { useEffect, useCallback, useState  }from 'react';
import { useUserContext } from './../../global/UserContext';
import { useWeb3Auth } from "../../services/web3auth";
import { ethers, BigNumber, utils  } from "ethers";
import { useFlowContext } from '../../global/FlowContext';
import { writeData, getTwitterHandleByAddress } from '../../firebase/firebase'

export type Payment = {
	handle: string
	token: string
	flowRate: string
	status: "open" | "closed"
	wallet: string
}

export const DisplayFlow = () => {
  const { userAddress, setUserAddress, RUDAddress, setRUDAddress, setButtonName, setUserInfo } = useUserContext();
	const { web3Auth, provider, getUserInfo } = useWeb3Auth();
  const { createFlow, toggleCreateFlow } = useFlowContext();
  const { updateFlow, toggleUpdateFlow } = useFlowContext();
  const { deleteFlow, toggleDeleteFlow } = useFlowContext();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
	const [fetchUserAddressTimer, setFetchUserAddressTimer] = useState<number | null>(null);
	const [fetchInterval, setFetchInterval] = useState<number | null>(null);
	const [displayGQLData, setDisplayGQLData] = useState("current")

	const [copyStatus, setCopyStatus] = useState("");
	const {toast} = useToast()

  const [activeFlows, setActiveFlows] = useState<Payment[]>([]);
  const [historicalFlows, setHistoricalFlows] = useState<Payment[]>([]);
	const [dataTable, setDataTable] = useState<Payment[]>([]);

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
	
	const fetchUserAddress = useCallback(async () => {
		try {
		const web3authProvider = await web3Auth?.connect();
		const provider = await new ethers.providers.Web3Provider(web3authProvider as any);
		const signer = provider.getSigner();
		const address = await signer.getAddress();
		setUserAddress(address.toLowerCase());

		const user = await getUserInfo();
		
		if (user) {
			const { name, profileImage, typeOfLogin } = user;
			setUserInfo({ name, profileImage, typeOfLogin });
			
      await writeData(name, address, profileImage);
		}
		setUserInfo(user);

		} catch (error) {
		console.error('Error fetching user address:', error);
		setUserAddress(null);
		}
	}, [web3Auth, setUserAddress, writeData]); 

	useEffect(() => {
	fetchUserAddress();

	const fetchUserAddressInterval = setInterval(fetchUserAddress, 5000); // Update every 5 seconds
	setFetchInterval(fetchUserAddressInterval as unknown as number);

	return () => {
		clearInterval(fetchUserAddressInterval);
	};
	}, [fetchUserAddress]);

  const GET_USER_FLOWS = gql`
    query MyQuery($sender: String!) {
      streams(where: { sender: $sender }) {
        currentFlowRate
				updatedAtTimestamp
				streamedUntilUpdatedAt
        token {
          symbol
        }
        sender {
          id
        }
        receiver {
          id	
        }
      }
    }
  `;

	const { loading, data, refetch } = useQuery(GET_USER_FLOWS, {
		variables: { sender: userAddress },
		client,
	});

	function calculateFlowRate(amount: string) {
		if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
		  alert("You can only calculate a flowRate based on a number");
		  return;
		} else if (typeof Number(amount) === "number") {
		  if (Number(amount) === 0) {
			return 0;
		  }
		  const monthlyFlowRate = Number(amount) * 3600 * 24 * 30;  // directly calculate the monthly flow rate
		  return Math.round(monthlyFlowRate);  // rounding off to the nearest whole number
		}
	  }

	useEffect(() => {
		if (!loading && data && data.streams) {
		  const fetchData = async () => {
			const activeFlowsData: Payment[] = [];
			const historicalFlowsData: Payment[] = [];
	  
			const receiverMap = new Map();
	  
			// Use a for...of loop to be able to use async/await inside
			for (const stream of data.streams) {
				const checksummedAddress = utils.getAddress(stream.receiver.id);
				const twitterHandle = await getTwitterHandleByAddress(checksummedAddress);
				
				const amountInWei = ethers.BigNumber.from(stream.currentFlowRate);
				const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
				const monthlyFlowRateUnrounded = parseFloat(monthlyAmount) * 3600 * 24 * 30;
				const monthlyFlowRate = monthlyFlowRateUnrounded.toFixed(2);
	  
			  const payment: Payment = {
				handle: twitterHandle ?? stream.receiver.id,
				token: stream.token.symbol,
				flowRate: monthlyFlowRate.toString() + `/month`,
				status: stream.currentFlowRate === '0' ? 'closed' : 'open',
				wallet: stream.receiver.id,
			  };
	  
			  // Check if the receiver address already exists in the map and has a non-zero flowRate
			  if (receiverMap.has(stream.receiver.id) && stream.currentFlowRate !== '0') {
				receiverMap.set(stream.receiver.id, payment); // Update the map with the new payment data
			  } else if (!receiverMap.has(stream.receiver.id)) {
				// If receiver address does not exist in the map, add the payment data to the map
				receiverMap.set(stream.receiver.id, payment);
			  }
			}
	  
			// Separate the data based on flowRate value
			receiverMap.forEach((payment) => {
				const flowRateInEtherPerMonth = parseFloat(payment.flowRate.split(' ')[0]);
				const flowRateInWeiPerMonth = ethers.utils.parseEther(flowRateInEtherPerMonth.toString());

				// Conversion back to the original flow rate in Wei per second
				const flowRateInWeiPerSecond = flowRateInWeiPerMonth.div(BigNumber.from(3600 * 24 * 30));
				const flowRateInWeiPerSecondConverted = flowRateInWeiPerSecond.toString()
			  if (flowRateInWeiPerSecondConverted === '0') {
				historicalFlowsData.push(payment);
			  } else {
				activeFlowsData.push(payment);
			  }
			});
	  
			setActiveFlows(activeFlowsData);
			setHistoricalFlows(historicalFlowsData);
			console.log("activeFlowsData", activeFlowsData);
			console.log("historicalFlowsData", historicalFlowsData);
			console.log("data set");
		  };
	  
		  fetchData();
		}
	  }, [loading, data]);

	useEffect(() => {
		const graphqlQueryInterval: number = window.setInterval(() => {
			refetch();
		}, 5000); // Update every 5 seconds
	
		return () => {
			window.clearInterval(graphqlQueryInterval);
		};
	}, [refetch]);
	
	useEffect(() => {
		setDataTable(activeFlows);
	}, [activeFlows]);

	const toastMessageSuccess = () => {
    toast({
      title: "Copied Successfully",
    })
  }

	const copyToClipboard = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			toastMessageSuccess()
		} catch (error) {
			console.error("Error copying to clipboard:", error);
		}
	};

	const columns: ColumnDef<Payment>[] = [
		{
			accessorKey: "handle",
			header: "Handle",
			cell: ({ row }) => (
				<div onClick={() => copyToClipboard(row.getValue("handle"))} className="hover:cursor-pointer">{row.getValue("handle")}</div>
			),
		},
		{
			accessorKey: "token",
			header: "Token",
			cell: ({ row }) => (
				<div onClick={() => copyToClipboard(row.getValue("token"))} className="hover:cursor-pointer">{row.getValue("token")}</div>
			),
		},
		{
			accessorKey: "flowRate",
			header: "Flow rate",
			cell: ({ row }) => (
				<div>{row.getValue("flowRate")}</div>
			),
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => (
				<div className={`capitalize flex items-center justify-center text-[12px] text-white py-[4px] max-w-[60px] rounded-sm ${
					row.getValue("flowRate") === "0.00/month" ? "bg-cancelButton" : "bg-streamButton"
				}`}>{row.getValue("status")}</div>
			),
		},
		{
			accessorKey: "wallet",
			header: "Wallet",
			cell: ({ row }) => (
				<div onClick={() => copyToClipboard(row.getValue("wallet"))} className="hover:cursor-pointer">{row.getValue("wallet")}</div>
			),
		},
		{
			id: "actions",
			enableHiding: false,
			cell: ({ row }) => {
				const payment = row.original
	 
				return (
					<div className="flex gap-4">
						
					{dataTable === activeFlows ?
					(
						<>
							<Button onClick={() => {
								setRUDAddress(dataTable[row.index]?.wallet);
								setButtonName("Update")
								toggleUpdateFlow();
							}}
							className="bg-streamButton hover:bg-streamButton bg-opacity-80 hover:bg-opacity-100 text-white text-sm">
								Update
							</Button>
							<Button
							onClick={() => {
								setRUDAddress(dataTable[row.index]?.wallet);
								setButtonName("Delete")
								toggleDeleteFlow();
							}}
							className="bg-cancelButton hover:bg-cancelButton bg-opacity-80 hover:bg-opacity-100 text-white text-sm">
								Delete
							</Button>
						</>
					)
					:
					(
						<>
						<Button 
							onClick={() => {
								setRUDAddress(dataTable[row.index]?.wallet);
								setButtonName("Reopen")
								toggleCreateFlow();
							}}
							variant="outline"
							className="bg-opacity-80 hover:bg-opacity-100  text-sm"
						>
							Reopen
						</Button>
						</>
					)
					}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								{/*<DropdownMenuItem
									onClick={() =>
										navigator.clipboard.writeText(
											dataTable[row.index]?.handle || ""
										)
									}
								>
									Copy @handle
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() =>
										navigator.clipboard.writeText(
											dataTable[row.index]?.wallet || ""
										)
									}
								>
									Copy 0xWallet
								</DropdownMenuItem>*/}
								<DropdownMenuSeparator />
								<DropdownMenuItem className="hover:cursor-pointer" onClick={() => window.open(`https://console.superfluid.finance/celo/accounts/${userAddress}?tab=streams`, '_blank')}
								>View streams</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)
			},
		},
	]
	
  const table = useReactTable({
    data: dataTable,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

	const handleDisplayGQLData = (value: string) => {
		if (value === "current") {
			setDataTable(activeFlows)
		} else if (value === "historical") {
			setDataTable(historicalFlows)
		}
	}

  return (
    <div className="w-full h-full flex flex-col text-black">
			<div className="w-full">
					<div className="w-full flex justify-between mb-8 sticky top-0 bg-white pb-4">
            <Button className="bg-white text-title hover:text-white border border-solid border-title hover:bg-title " onClick={toggleCreateFlow}>
              Create flow
            </Button>
            <Tabs defaultValue="current" className="max-w-[250px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="current" onClick={() => handleDisplayGQLData("current")}>Current</TabsTrigger>
                <TabsTrigger value="historical" onClick={() => handleDisplayGQLData("historical")}>History</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
				{/*<div className="flex items-center py-4">
					<Input
						placeholder="Filter emails..."
						value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
						onChange={(event) =>
							table.getColumn("email")?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="ml-auto">
								Filter <ChevronDown className="ml-2 h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) =>
												column.toggleVisibility(!!value)
											}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									)
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>*/}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext()
														)}
											</TableHead>
										)
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="flex-1 text-sm text-muted-foreground">
						{table.getFilteredSelectedRowModel().rows.length} of{" "}
						{table.getFilteredRowModel().rows.length} row(s) selected.
					</div>
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</div>
				</div>
			</div>

			{/*<div className="text-black text-3xl" onClick={test}>
					Test
							</div>*/}
    </div>
  );
};
