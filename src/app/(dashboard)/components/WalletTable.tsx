"use client";
import {FaSort, FaSpinner, FaChevronDown, FaChevronRight, FaCheckCircle} from "react-icons/fa";
import {MdCancel} from "react-icons/md";
import AssetModifyMenu from "@/app/(dashboard)/components/AssetModifyMenu";
import {walletProps} from "@/types/wallet";
import React, {useState} from "react";
import {useWalletStore} from "@/store/useWalletStore";
import {Asset} from "@/types/assets";
import {useNotification} from "@/app/(dashboard)/components/changeNotification";

export default function WalletTable({tableHeaders, isLoading, handleSort, sortedFilteredAssets, error, getAssets}: walletProps) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedValues, setEditedValues] = useState<Asset>({} as Asset);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const { showNotification } = useNotification();

    const triggerRefresh = useWalletStore((state) => state.triggerRefresh);

    // quantity of items on page
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    const indexOfLastAsset = currentPage * itemsPerPage;
    const indexOfFirstAsset = indexOfLastAsset - itemsPerPage;
    const currentAssets = sortedFilteredAssets.slice(indexOfFirstAsset, indexOfLastAsset);

    // buttons for changing pages
    const totalPages = Math.ceil(sortedFilteredAssets.length / itemsPerPage);

    const maxVisible = 3;
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = startPage + maxVisible - 1;

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxVisible + 1, 1);
    }

    const visiblePages:number[] = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    // editing assets
    const startEditing = (asset: Asset) => {
        setEditingId(asset._id);
        setEditedValues(asset);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditedValues({} as Asset);
    };

    const handleChange = (key: string, value: string | number) => {
        setEditedValues((prev: Asset) => ({ ...prev, [key]: value }));
    };

    const saveChanges = async () => {
        const res = await fetch("/api/user/assets", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ editedValues }),
        });

        const data = await res.json();

        if (!data.success) {
            console.error(data.error);
        }
        showNotification("Asset have been modified");
        cancelEditing();
        triggerRefresh();
    };

    const editableInput = (key: string, value: string | number) => (
        <input
            key={key}
            className={`
                w-full py-1 px-2 text-center outline-none font-semibold rounded-md transition
                border-2 shadow-sm
                bg-light-bg text-light-text border-light-main
                focus:bg-light-bg-secondary focus:border-light-secondary
                dark:bg-dark-bg dark:text-dark-text dark:border-dark-main
                dark:focus:bg-dark-bg-secondary dark:focus:border-dark-secondary
                focus:shadow-[0_0_0_2px_var(--color-light-main)]
                dark:focus:shadow-[0_0_0_2px_var(--color-dark-main)]
                duration-150
            `}
            value={value}
            onChange={e => handleChange(key, e.target.value)}
            style={{
                boxShadow: '0 1px 4px 0 rgba(168,130,221,0.13)',
            }}
        />
    );

    const toggleExpand = (id: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <React.Fragment>
            <main className={`
                bg-light-bg-secondary dark:bg-dark-bg-tertiary
                text-light-text dark:text-dark-text
                w-full min-h-screen rounded-2xl shadow-sm tracking-tight overflow-auto
            `}>
                <table className={"w-full px-2 "}>
                    <thead className="w-full">
                    <tr className="w-full cursor-default border-b-2 rounded-4xl border-light-main dark:border-dark-main">
                        <th />
                        {tableHeaders.map((item, index) => (
                            <th key={index}
                                // className={index > 2 ? "hidden lg:table-cell" : ""}>
                                className={index > 9 ? "hidden" : index > 2 ? "hidden lg:table-cell" : ""}>
                                <div className={"flex items-center gap-1 justify-center text-lg my-2 font-medium px-1 tiny:px-2 text-dark-text-secondary"}>
                                    {item.label}
                                    <FaSort onClick={() => handleSort(item.key)} className={"text-light-main dark:text-dark-main cursor-pointer "} />
                                </div>
                            </th>
                        ))}
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading && (
                        <tr>
                            <td colSpan={tableHeaders.length + 2} className="text-center py-10">
                                <FaSpinner className="animate-spin text-4xl mx-auto text-light-main dark:text-dark-main" />
                            </td>
                        </tr>
                    )}
                    {!isLoading && sortedFilteredAssets && (
                        currentAssets.map( asset => {
                            const isEditing = asset._id === editingId;
                            const isExpanded = expandedRows[asset._id];

                            return (
                                <React.Fragment key={asset._id}>
                                    <tr
                                        className="cursor-default rounded-4xl text-center text-xl font-medium odd:bg-light-bg odd:dark:bg-[hsl(258,21%,30%)] text-light-text dark:text-dark-text"
                                    >
                                        <td className="w-8 px-2">
                                            <button
                                                aria-label={isExpanded ? "Zwiń szczegóły" : "Rozwiń szczegóły"}
                                                className={`
                                                        flex items-center justify-center w-7 h-7
                                                        rounded-md transition
                                                        bg-transparent  dark:bg-transparent
                                                        hover:bg-light-main hover:dark:bg-dark-main
                                                    `}
                                                onClick={() => toggleExpand(asset._id)}
                                            >
                                                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                                            </button>
                                        </td>
                                        {asset.addedManually && isEditing && editedValues
                                            ? <td className={"p-1"}> {editableInput("ticker", editedValues.ticker!)}</td>
                                            : <td className={"py-2"}>{asset.ticker}</td>}
                                        {asset.addedManually && isEditing && editedValues
                                            ? <td className={"p-1"}> {editableInput("type", editedValues.type)}</td>
                                            : <td className={"py-2"}>{asset.type}</td>}
                                        {asset.addedManually && isEditing && editedValues
                                            ? <td className={"p-1"}> {editableInput("name", editedValues.name)}</td>
                                            : <td className={"py-2"}>{asset.name}</td>}
                                        <td className="hidden lg:table-cell">
                                            {isEditing && editedValues
                                                ? editableInput("quantity", editedValues.quantity)
                                                : asset.quantity}
                                        </td>
                                        <td className="hidden lg:table-cell">
                                            {isEditing && editedValues
                                                ? editableInput("purchaseUnitPrice", editedValues.purchaseUnitPrice)
                                                : asset.purchaseUnitPrice}
                                        </td>
                                        <td className="hidden lg:table-cell">
                                            {asset.addedManually && isEditing && editedValues
                                                ? editableInput("lastUnitPrice", editedValues.lastUnitPrice)
                                                : asset.lastUnitPrice}
                                        </td>
                                        <td className="hidden lg:table-cell">
                                            {asset.totalValue}
                                        </td>
                                        <td className="hidden lg:table-cell">
                                            {asset.addedManually && isEditing && editedValues
                                                ? editableInput("currency", editedValues.currency)
                                                : asset.currency}
                                        </td>
                                        <td className={`hidden lg:table-cell ${ (asset.dailyChange > 0) ? "text-green-500" : "text-light-error-text dark:text-dark-error-text"}`}>
                                            {`${asset.dailyChange > 0 ? "+" : ""}${asset.dailyChange} ${asset.dailyChangePercent && `(${asset.dailyChangePercent > 0 ? "+" : ""}${asset.dailyChangePercent}%)`}`}
                                        </td>
                                        {asset.profit_loss ? (
                                        <td className={`hidden lg:table-cell ${ (asset.profit_loss > 0) ? "text-green-500" : "text-light-error-text dark:text-dark-error-text"}`}>
                                            {`${asset.profit_loss > 0 ? "+" : ""}${asset.profit_loss} (${asset.profit_lossPercent && (asset.profit_lossPercent > 0 )? "+" : ""}${asset.profit_lossPercent}%)`}
                                        </td>
                                            ) : null}
                                        <td className={"table-cell py-1"}>
                                            {isEditing ? (
                                                <div className={"flex items-center justify-evenly gap-2 w-full px-2"}>
                                                    <FaCheckCircle size={23} className={"text-green-500 cursor-pointer"} onClick={saveChanges} />
                                                    <MdCancel size={26} className={"text-light-error-text dark:text-dark-error-text cursor-pointer"} onClick={cancelEditing} />
                                                </div>
                                            ) : (
                                                <AssetModifyMenu id={asset._id} refresh={getAssets} showNotification={showNotification} handleEdit={() => startEditing(asset)} />
                                            )}
                                        </td>
                                    </tr>
                                    {isExpanded && (
                                        <tr className={"odd:bg-light-bg odd:dark:bg-[hsl(258,21%,30%)] text-light-text dark:text-dark-text"}>
                                            <td colSpan={tableHeaders.length + 2} className="p-0 ">
                                                <div
                                                    className={`
                                                        flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-20
                                                        px-4 py-4 text-lg font-medium
                                                        text-light-text dark:text-dark-text`}>
                                                    {asset.quantity ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("quantity")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Quantity:&nbsp;</span>
                                                            {isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("quantity", editedValues.quantity)}</span>
                                                                : <span className={"text-xl"}>{asset.quantity}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.purchaseUnitPrice ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("purchaseUnitPrice")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Purchase Unit Price:&nbsp;</span>
                                                            {isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("purchaseUnitPrice", editedValues.purchaseUnitPrice)}</span>
                                                                : <span className={"text-xl"}>{asset.purchaseUnitPrice}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.lastUnitPrice ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("lastUnitPrice")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Last Unit Price:&nbsp;</span>
                                                            {asset.addedManually && isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("lastUnitPrice", editedValues.lastUnitPrice)}</span>
                                                                : <span className={"text-xl"}>{asset.lastUnitPrice}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.totalValue ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("totalValue")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Total Value:&nbsp;</span>
                                                            {asset.addedManually && isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("totalValue", editedValues.totalValue!)}</span>
                                                                : <span className={"text-xl"}>{asset.totalValue}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.currency ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("currency")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Currency:&nbsp;</span>
                                                            {asset.addedManually && isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("currency", editedValues.currency)}</span>
                                                                : <span className={"text-xl"}>{asset.currency}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.dailyChange ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("dailyChange")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Daily Change:&nbsp;</span>
                                                            <span className={`text-xl ${ (asset.dailyChange > 0) ? "text-green-500" : "text-light-error-text dark:text-dark-error-text"}`}>
                                                                {`${asset.dailyChange > 0 ? "+" : ""}${asset.dailyChange} (${asset.dailyChangePercent && (asset.dailyChangePercent > 0) ? "+" : ""}${asset.dailyChangePercent}%)`}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                    {asset.profit_loss ? (
                                                        <div className={`flex items-center lg:hidden`}>
                                                            <FaSort onClick={() => handleSort("profit_loss")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Profit/Loss:&nbsp;</span>
                                                            <span className={`text-xl ${ (asset.profit_loss > 0) ? "text-green-500" : "text-light-error-text dark:text-dark-error-text"}`}>
                                                                {`${asset.profit_loss > 0 ? "+" : ""}${asset.profit_loss} (${asset.profit_lossPercent && (asset.profit_lossPercent > 0 )? "+" : ""}${asset.profit_lossPercent}%)`}
                                                            </span>
                                                        </div>
                                                    ) : null}
                                                    {asset.country ? (
                                                        <div className={`flex items-center `}>
                                                            <FaSort onClick={() => handleSort("country")} className={"text-light-main dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Country:&nbsp;</span>
                                                            {asset.addedManually && isEditing && editedValues
                                                                ? <span className={"p-1"}> {editableInput("country", editedValues.country)}</span>
                                                                : <span className={"text-xl"}>{asset.country}</span>}
                                                        </div>
                                                    ) : null}
                                                    {asset.createdAt ? (
                                                        <div className={`flex items-center `}>
                                                            <FaSort onClick={() => handleSort("createdAt")} className={"text-light-text-tertiary dark:text-dark-main cursor-pointer mr-1 "} />
                                                            <span className="font-semibold text-dark-text-secondary">Created At:&nbsp;</span>
                                                            <span className={"text-xl"}>{String(asset.createdAt)}</span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })
                    )}
                    {error && (
                        <tr>
                            <td colSpan={tableHeaders.length + 2} className="text-center py-10 text-light-error-text dark:text-dark-error-text">
                                {error}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </main>
            <footer className={"flex justify-between mb-15 mx-2 lg:mb-0 font-medium text-md text-light-text dark:text-dark-text"}>
                <div className="px-2 flex items-center gap-2">
                    <span>Items per page:</span>
                    <input
                        type="number"
                        min={1}
                        value={itemsPerPage}
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value) && value > 0) {
                                setItemsPerPage(value);
                                setCurrentPage(1);
                            }
                        }}
                        className="w-16 px-2 py-1 border-2 border-light-main dark:border-dark-main rounded shadow-sm focus:border-light-secondary dark:focus:border-dark-secondary outline-none"
                    />
                </div>
                <div className="flex items-center gap-2 ">
                    {visiblePages.map((page) => {
                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded cursor-pointer shadow-sm ${currentPage === page ? "bg-light-main dark:bg-dark-main text-white" : "bg-light-bg-secondary dark:bg-dark-bg-secondary"}`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
            </footer>
        </React.Fragment>
    );
}