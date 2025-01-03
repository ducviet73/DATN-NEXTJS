import { addToCart } from "@/redux/slices/cartSlices";
import { useDispatch } from "react-redux";

export default function AddCartButton(props) {
    const dispatch = useDispatch();
    const { data, quantity, selectedSize, selectedColor } = props;

    if (!data || !data._id) {
        console.error('Invalid data provided:', data);
        return null;
    }

    return (
        <button
            className="detail_addtocart"
            onClick={() => dispatch(addToCart({
                id: data._id,
                quantity,
                size: selectedSize,
                color: selectedColor
            }))}
        >
            {props.children}
        </button>
    );
}
