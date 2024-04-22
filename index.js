import { menuArray } from "./data.js";
import { v4 as uuidv4 } from "uuid";

const itemsDiv = document.querySelector(".items");
const checkoutDiv = document.querySelector(".checkout");
const orderDiv = document.querySelector(".your-order-container");
const totalDiv = document.querySelector(".total");
const modal = document.getElementById("modal");
const closeModal = document.querySelector(".close-modal");
const modalPayBtn = document.querySelector(".modal-pay-button");
const nameInput = document.getElementById("name");
let totalOrder = [];

window.onload = main();

function main() {
  const myData = menuArray.map((food) => {
    return `<div class="food-item" id="${food.id}">
        <div class="img-container">
        <img src="${food.image}">
        </div>
        <div class="info">
        <h4>${food.name}</h4>
        <p class="ingredients">${food.ingredients}</p>
        <p class="price">$${food.price}</p>
        </div>
        <button class="add-button" data-id="${food.id}" id="${food.id}">+</button>
        </div>`;
  });

  itemsDiv.innerHTML = myData.join("");
}

function renderOrder() {
  if (totalOrder.length === 0) {
    orderDiv.style.display = "none";
  } else {
    orderDiv.style.display = "flex";
  }
}

itemsDiv.addEventListener("click", function (e) {
  // Find the menu item corresponding to the clicked button
  const clickedItem = menuArray.filter(
    (item) => item.id === parseInt(e.target.dataset.id)
  );
  console.log("works");
  // If a matching item is found, create HTML for it
  const uniqueId = uuidv4();
  clickedItem.map((item) => {
    totalOrder.unshift({ name: item.name, price: item.price, id: uniqueId });
    renderHtml();
    renderOrder();
    totalDiv.style.display = "block";
  })[0];
});

function renderHtml() {
  checkoutDiv.innerHTML = totalOrder.map((item) => {
    return `<div class=checkout-container>
           
    <div class="checkout-items-container">
            <div class="item-name-and-remove-button">
            <p>${item.name}</p>
            <button class="remove" data-id="${item.id}">remove</button>
            </div>
            <p>$${item.price}</p>
            </div>
        </div>`;
  });
  totalPrice();
}

checkoutDiv.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove")) console.log("works");
  totalOrder = totalOrder.filter((item) => {
    return item.id !== e.target.dataset.id;
  });

  renderHtml();
  renderOrder();
  e.stopPropagation();
});

function totalPrice() {
  // Calculate total price without discount
  const totalAmount = totalOrder
    ? totalOrder.reduce((total, current) => total + current.price, 0)
    : 0;

  // Apply discount if total price is more than 50
  const discountedTotal =
    totalAmount > 50 ? totalAmount - totalAmount * 0.1 : totalAmount;

  if (discountedTotal > 50) {
    totalDiv.innerHTML = `
          
        <div class="total-price-container">
        <h4>Total Price:</h4>
        <h4>$${discountedTotal.toFixed(2)}</h4>
        </div>
        <p>10% discount applied</p>
        <div class="complete-order-btn-container"> 
        <button class="complete-order-btn" data-id="complete-order-btn">Complete Order</button>
       </div>
`;
  } else {
    totalDiv.innerHTML = `
            
            <div class="total-price-container">
                <h4>Total Price:</h4>
                <h4>$${discountedTotal.toFixed(2)}</h4>
                </div>
                <div class="complete-order-btn-container"> 
                <button class="complete-order-btn" data-id="complete-order-btn">Complete Order</button>
               </div>
        `;
  }
}

totalDiv.addEventListener("click", function (e) {
  if (e.target.dataset.id === "complete-order-btn") {
    modal.showModal();
  }
});

closeModal.addEventListener("click", function () {
  modal.close();
});

modalPayBtn.addEventListener("click", function () {
  totalDiv.style.display = "none";
  checkoutDiv.innerHTML = `<div class="thank-you">
        <h4>Thank you ${nameInput.value}! <br> Your order is on the way! </h4>
        </div>`;

  totalOrder = [];
});
