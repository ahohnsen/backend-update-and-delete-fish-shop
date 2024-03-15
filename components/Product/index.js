import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import ProductForm from "../ProductForm/index.js";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import { StyledButton } from "../Button/Button.styled";
import { StyledForm, StyledHeading, StyledLabel } from "../ProductForm/ProductForm.styled.js";
import Comments from "../Comments";

export default function Product() {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);
  const [isEditMode, setIsEditMode] = useState(false);

  async function handleEditProduct(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      console.error(response.status);
      return;
    }

    mutate();
  }

  async function handleDeleteProduct() {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      router.push("/");
    } else {
      console.error(response.status);
    }
  }

  async function handleAddComment(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const commentData = Object.fromEntries(formData);

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId: id, review: commentData }),
    });

    if (!response.ok) {
      console.error(response.status);
      return;
    }

    mutate();
    event.target.reset();
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return;
  }

  return (
    <>
      <ProductCard>
        <h2>{data.name}</h2>
        <p>Description: {data.description}</p>
        <p>
          Price: {data.price} {data.currency}
        </p>
        {data.reviews.length > 0 && <Comments reviews={data.reviews} />}
        <StyledForm onSubmit={handleAddComment}>
          <StyledLabel htmlFor="title">
            Title:
            <input type="text" id="title" name="title" />
          </StyledLabel>
          <StyledLabel htmlFor="text">
            Text:
            <input type="text" id="text" name="text" />
          </StyledLabel>
          <StyledLabel htmlFor="rating">
            Rating:
            <input type="number" id="rating" name="rating" min="0" max="5" />
          </StyledLabel>
          <StyledButton type="submit">Add comment</StyledButton>
        </StyledForm>

        <StyledButton type="button" onClick={() => setIsEditMode(!isEditMode)}>
          Edit fish
        </StyledButton>
        <StyledButton type="button" onClick={() => handleDeleteProduct(id)}>
          Delete fish
        </StyledButton>
      </ProductCard>
      {isEditMode && (
        <ProductForm onSubmit={handleEditProduct} heading={"Update fish"} value={data} />
      )}
      <StyledLink href="/">Back to all</StyledLink>
    </>
  );
}
