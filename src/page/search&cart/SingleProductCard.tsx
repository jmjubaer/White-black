import React, { useEffect, useState } from "react"; // Assuming MenuItem type is defined in types.ts
import { FiMinus, FiPlus } from "react-icons/fi";
import pleceholderImage from "../../assets/pleceholder.png";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { TCartItem } from "../../components/type/Types";
import Swal from "sweetalert2";
import { useGetToCardLocal } from "../../hooks/useGetToCardLocal";
interface SingleProductCardProps {
    value: TCartItem;
    cartItems: {
        localStoreId: number; menuItemId: string; quantity: number 
}[];
    buyAvailProducts: { menuItemId: string; quantity: number }[];
    setBuyAvailProducts: Function;
    setCartItems: Function;
    handleQuantityIncrement: (menuItemId: string) => void;
    handleQuantityDecrement: (menuItemId: string) => void;
}

const SingleProductCard: React.FC<SingleProductCardProps> = ({
    value,
    cartItems,
    setCartItems,
    handleQuantityIncrement,
    handleQuantityDecrement,
}) => {
    const { ReFetching } = useGetToCardLocal();

    const [isSoldOut, setIsSoldOut] = useState(false);
    const [notAvailable, setNotAvailable] = useState(true);
    useEffect(() => {
        (async () => {
            try {
                if (!value.menuItemId) {
                    return;
                }
                const response = await fetch(
                    `https://amlaa.vercel.app/product/${value.menuItemId}`
                );

                const result = await response.json();

                // console.log(result);
                if (result.status) {
                    setNotAvailable(false);
                    if (result.status == "sold-out") {
                        setIsSoldOut(true);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [value]);
    // console.log(value);

    const cartItem = cartItems.find(
        (item) => item.localStoreId === value.localStoreId
    ) || { quantity: 0 };
    const handleRemoveFromCart = (menuItemId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result: { isConfirmed: any }) => {
            if (result.isConfirmed) {
                const restProducts = cartItems.filter(
                    (item) => item.localStoreId !== menuItemId
                );
                console.log(menuItemId);
                if (restProducts) {
                    localStorage.setItem(
                        "product",
                        JSON.stringify(restProducts)
                    );
                    setCartItems(restProducts);
                }
                ReFetching();
                Swal.fire({
                    title: "Deleted!",
                    text: "Your product has been deleted.",
                    icon: "success",
                });
            }
        });
    };
    const calculateDiscountedPrice = () => {
        if (value?.discount && value.price) {
            const discountAmount = (value.price * value.discount) / 100;
            return value.price - discountAmount;
        }
        return null;
    };

    const discountedPrice = calculateDiscountedPrice();
    return (
        <tr className='border-b  border-gray-500 '>
            <td className=' h-52 w-[150px] relative overflow-hidden rounded'>
                <img src={value?.image || pleceholderImage} alt={value?.name} />
                {(isSoldOut || notAvailable) && (
                    <div className='absolute flex items-center justify-center top-0 left-0 bg-slate-600 bg-opacity-60 text-black font-bold w-full h-full text-center'>
                        {isSoldOut
                            ? "Sold Out"
                            : notAvailable
                            ? "Product Not Available"
                            : null}
                    </div>
                )}
            </td>
            <td className='ps-10'>
                <div>
                    <Link
                        to={`/product/${value.menuItemId}`}
                        className='text-lg font-semibold hover:underline'>
                        {value?.name}
                    </Link>
                    <p>
                        <span className='font-medium'>Style:</span>
                        <span className='ml-1'>{value?.detailsMaterial}</span>
                    </p>
                    <p>
                        <span className='font-medium'>Color:</span>
                        <span className='ml-1'>{value?.color || "N/A"}</span>
                    </p>
                    <p>
                        <span className='font-medium'>Size:</span>
                        <span className='ml-1'>{value?.size || "N/A"}</span>
                    </p>
                </div>
            </td>
            <td className='p-2 text-center'>
                <div className='flex justify-center items-center gap-4'>
                    <FiMinus
                        onClick={() =>
                            handleQuantityDecrement(String(value.localStoreId))
                        }
                        className='cursor-pointer'
                    />
                    <p>{cartItem.quantity}</p>
                    <FiPlus
                        onClick={() =>
                            handleQuantityIncrement(String(value.localStoreId))
                        }
                        className='cursor-pointer'
                    />
                </div>
            </td>
            <td className=' text-center'>
                &#x09F3;
                {value.price ? (
                    <span
                        className={`${
                            (notAvailable || isSoldOut) && "line-through"
                        }`}>
                        {discountedPrice
                            ? discountedPrice
                            : parseFloat(
                                String( value.price * cartItem.quantity)
                              ).toFixed(2)}
                    </span>
                ) : (
                    "00"
                )}
            </td>
            <td className='flex items-center h-52 justify-center'>
                <button
                    className='text-3xl text-red-500 mt-5'
                    onClick={() => handleRemoveFromCart(value.localStoreId)}>
                    <MdDelete />
                </button>
            </td>
        </tr>
    );
};

export default SingleProductCard;
