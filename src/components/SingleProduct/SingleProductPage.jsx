import React, { memo, useContext, useEffect, useState } from "react";
import "./SingleProductPage.css";
import QuantityInput from "./QuantityInput";
import config from "../../config.json";
import { useParams } from "react-router-dom";
import useData from "../../hooks/useData";
import Loader from "../Common/Loader";
import CartContext from "../../contexts/CartContext";
import UserContext from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const SingleProductPage = () => {
  const [selectedImage, setselectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedIcon, setShowAddedIcon] = useState(false);
  const { id } = useParams();
  const { addToCart, removeFromCart, cart } = useContext(CartContext);
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const { data: product, error, isLoading } = useData(`/products/${id}`);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (product && cart) {
      const itemInCart = cart.find((item) => item.product._id === product._id);
      setIsInCart(!!itemInCart);
      if (itemInCart) {
        setQuantity(itemInCart.quantity);
      }
    }
  }, [cart, product]);

  const handleRemoveFromCart = () => {
    removeFromCart(product._id);
    setQuantity(1); // Reset quantity to 1 when removing from cart
    setIsInCart(false);
  };

  return (
    <section className="align_center single_product">
      {isLoading && <Loader />}
      {error && <em className="form_error">{error}</em>}
      {product && (
        <>
          <div className="align_center">
            <div className="single_product_teumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={`${config.backendURL}/products/${image}`}
                  alt={product.title}
                  className={selectedImage === index ? "selected_image" : ""}
                  onClick={() => setselectedImage(index)}
                />
              ))}
            </div>
            <img
              src={`${config.backendURL}/products/${product.images[selectedImage]}`}
              alt={product.title}
              className="single_product_display"
            />
          </div>
          <div className="single_product_details">
            <h1 className="single_product_title">{product.title}</h1>
            <p className="single_product_description">{product.description}</p>
            {user ? (
              <>
                {" "}
                <p className="single_product_price">
                  ${product.price.toFixed(2)}
                </p>
                <h2 className="quntity_title">Quantity : </h2>
                <QuantityInput
                  quantity={quantity}
                  setQuantity={(newQuantity) => {
                    setQuantity(newQuantity);
                    setIsInCart(false); // Reset to Add to Cart state when quantity changes
                  }}
                  stock={product.stock}
                />
                {!isInCart ? (
                  <button
                    className="search_button add_cart"
                    onClick={() => {
                      addToCart(product, quantity);
                      setShowAddedIcon(true);
                      setTimeout(() => setShowAddedIcon(false), 2000);
                    }}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                ) : (
                  <div className="cart_actions">
                    <button
                      className="search_button remove_cart"
                      onClick={handleRemoveFromCart}
                    >
                      Remove from Cart
                    </button>
                  </div>
                )}
                
              </>
            ) : (
              <button
                className="search_button login_button"
                onClick={() => navigate("/login")}
              >
                Login to Add to Cart
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default memo(SingleProductPage);
