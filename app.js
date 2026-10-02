// ========================================
// SARI-SARI STORE MANAGER
// INVENTORY MODULE
// ========================================


// Product storage

let products =
    JSON.parse(localStorage.getItem("products")) || [];


function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}


// Get HTML elements

const addProductButton =
    document.getElementById("addProductButton");

const productModal =
    document.getElementById("productModal");

const cancelProduct =
    document.getElementById("cancelProduct");

const saveProduct =
    document.getElementById("saveProduct");

const productTable =
    document.getElementById("productTable");

const searchProduct =
    document.getElementById("searchProduct");


// ========================================
// OPEN PRODUCT FORM
// ========================================

addProductButton.addEventListener("click", function() {

    productModal.style.display = "flex";

});


// ========================================
// CLOSE PRODUCT FORM
// ========================================

cancelProduct.addEventListener("click", function() {

    productModal.style.display = "none";

});


// ========================================
// SAVE PRODUCT
// ========================================

saveProduct.addEventListener("click", function() {

    // Get values from form

    const name =
        document.getElementById("productName").value;

    const category =
        document.getElementById("productCategory").value;

    const stock =
        Number(document.getElementById("productStock").value);

    const buyPrice =
        Number(document.getElementById("buyPrice").value);

    const sellPrice =
        Number(document.getElementById("sellPrice").value);

    const lowStockLimit =
        Number(document.getElementById("lowStockLimit").value);


    // Check product name

    if (name === "") {

        alert("Please enter a product name.");

        return;

    }


    // Create product object

    const product = {

        id: Date.now(),

        name: name,

        category: category,

        stock: stock,

        buyPrice: buyPrice,

        sellPrice: sellPrice,

        lowStockLimit: lowStockLimit

    };


    // Add product

    products.push(product);

    saveProducts();
    updateCategoryFilter();
    populateSaleProducts();


    // Clear form

    document.getElementById("productName").value = "";

    document.getElementById("productCategory").value = "";

    document.getElementById("productStock").value = "";

    document.getElementById("buyPrice").value = "";

    document.getElementById("sellPrice").value = "";

    document.getElementById("lowStockLimit").value = "5";


    // Close modal

    productModal.style.display = "none";


    // Display products

    displayProducts();

    updateDashboard();

});


// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts() {

    productTable.innerHTML = "";


    products.forEach(function(product) {

        const row =
            document.createElement("tr");


        // Determine stock status

        let status;

        if (product.stock === 0) {
            status = "Out of Stock";
        } else if (product.stock <= product.lowStockLimit) {

            status =
                `<span class="status-low">⚠ Low Stock</span>`;

        } else {

            status =
                `<span class="status-ok">✓ OK</span>`;

        }


        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.stock}</td>

            <td>₱${product.buyPrice.toFixed(2)}</td>

            <td>₱${product.sellPrice.toFixed(2)}</td>

            <td>${status}</td>

            <td>

                <button onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button onclick="restockProduct(${product.id})">
                    Restock
                </button>

                <button onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </td>

        `;


        productTable.appendChild(row);

    });

}


// ========================================
// DELETE PRODUCT
// ========================================

function deleteProduct(id) {

    const confirmed =
        confirm("Are you sure you want to delete this product?");


    if (!confirmed) {

        return;

    }


    products =
        products.filter(function(product) {

            return product.id !== id;

        });

    saveProducts();
    populateSaleProducts();


    displayProducts();

    updateDashboard();

}


// ========================================
// SEARCH PRODUCTS
// ========================================

searchProduct.addEventListener("input", function() {

    const search =
        searchProduct.value.toLowerCase();


    const filteredProducts =
        products.filter(function(product) {

            return product.name.toLowerCase().includes(search) ||
                   product.category.toLowerCase().includes(search);

        });


    productTable.innerHTML = "";


    filteredProducts.forEach(function(product) {

        const row =
            document.createElement("tr");


        let status;

        if (product.stock <= product.lowStockLimit) {

            status =
                `<span class="status-low">⚠ Low Stock</span>`;

        } else {

            status =
                `<span class="status-ok">✓ OK</span>`;

        }


        row.innerHTML = `

            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.stock}</td>

            <td>₱${product.buyPrice.toFixed(2)}</td>

            <td>₱${product.sellPrice.toFixed(2)}</td>

            <td>${status}</td>

            <td>

                <button onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </td>

        `;


        productTable.appendChild(row);

    });

});


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    document.getElementById("totalProducts").textContent =
        products.length;


    const lowStockProducts =
        products.filter(function(product) {

            return product.stock <= product.lowStockLimit;

        });


    document.getElementById("lowStock").textContent =
        lowStockProducts.length;

    const totalUtang = customers.reduce(function(total, customer) {
        return total + customer.balance;
    }, 0);

    document.getElementById("totalUtang").textContent =
        "₱" + totalUtang.toFixed(2);

    const totalUtang2 = customers.reduce(function(total, customer) {
        return total + Number(customer.balance);
    }, 0);

    document.getElementById("totalUtang").textContent =
        "₱" + totalUtang2.toFixed(2);

    const today = new Date().toISOString().split("T")[0];

    const todaySales = sales
        .filter(function(sale) {
            return sale.date.startsWith(today);
        })
        .reduce(function(total, sale) {
            return total + sale.total;
        }, 0);

    document.getElementById("todaySales").textContent =
        "₱" + todaySales.toFixed(2);

    const totalProfit = sales.reduce(function(total, sale) {
        return total + Number(sale.profit || 0);
    }, 0);

    document.getElementById("totalProfit").textContent =
        "₱" + totalProfit.toFixed(2);

    const lowStockList = document.getElementById("lowStockList");

    lowStockList.innerHTML = "";

    products.forEach(function(product) {
        if (product.stock <= product.lowStockLimit) {
            lowStockList.innerHTML += `
                <p>⚠ ${product.name} - ${product.stock} left</p>
            `;
        }
    });

    if (lowStockList.innerHTML === "") {
        lowStockList.innerHTML = "<p>✓ No low-stock products</p>";
    }

    const inventoryValue = products.reduce(function(total, product) {
        return total + (product.stock * product.buyPrice);
    }, 0);

    document.getElementById("inventoryValue").textContent =
        "₱" + inventoryValue.toFixed(2);

    const expectedSales = products.reduce(function(total, product) {
        return total + (product.stock * product.sellPrice);
    }, 0);

    document.getElementById("expectedSales").textContent =
        "₱" + expectedSales.toFixed(2);

    const potentialProfit = products.reduce(function(total, product) {
        return total +
            ((product.sellPrice - product.buyPrice) * product.stock);
    }, 0);

    document.getElementById("potentialProfit").textContent =
        "₱" + potentialProfit.toFixed(2);

    const todayTransactions = sales.filter(function(sale) {
        return new Date(sale.date).toDateString() === new Date().toDateString();
    }).length;

    document.getElementById("todayTransactions").textContent = todayTransactions;

    if (lowStockProducts.length > 0) {
        document.getElementById("lowStockAlert").textContent =
            lowStockProducts.length + " product(s) need restocking.";
    } else {
        document.getElementById("lowStockAlert").textContent =
            "No low stock products.";
    }

}
// ========================================
// EDIT PRODUCT
// ========================================

function editProduct(id) {

    const product =
        products.find(function(product) {

            return product.id === id;

        });


    if (!product) {

        return;

    }


    // Ask for new values

    const newName =
        prompt("Product name:", product.name);


    if (newName === null) {

        return;

    }


    const newCategory =
        prompt("Category:", product.category);


    if (newCategory === null) {

        return;

    }


    const newStock =
        prompt("Stock:", product.stock);


    if (newStock === null) {

        return;

    }


    const newBuyPrice =
        prompt("Buying price:", product.buyPrice);


    if (newBuyPrice === null) {

        return;

    }


    const newSellPrice =
        prompt("Selling price:", product.sellPrice);


    if (newSellPrice === null) {

        return;

    }


    // Update product

    product.name = newName;

    product.category = newCategory;

    product.stock = Number(newStock);

    product.buyPrice = Number(newBuyPrice);

    product.sellPrice = Number(newSellPrice);

    saveProducts();
    populateSaleProducts();


    // Refresh display

    displayProducts();

    updateDashboard();

}
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let cart = [];
let sales = JSON.parse(localStorage.getItem("sales")) || [];
let paymentHistory = JSON.parse(localStorage.getItem("paymentHistory")) || [];
let stockHistory = JSON.parse(localStorage.getItem("stockHistory")) || [];

const newSaleButton = document.getElementById("newSaleButton");
const salesSection = document.getElementById("salesSection");
const saleProduct = document.getElementById("saleProduct");
const saleQuantity = document.getElementById("saleQuantity");
const addToCartButton = document.getElementById("addToCartButton");
const cartTable = document.getElementById("cartTable");
const saleTotal = document.getElementById("saleTotal");
const completeSaleButton = document.getElementById("completeSaleButton");
const paymentType = document.getElementById("paymentType");
const utangCustomer = document.getElementById("utangCustomer");

newSaleButton.addEventListener("click", function() {
    salesSection.style.display = "block";

    saleProduct.innerHTML = '<option value="">Select Product</option>';
    utangCustomer.innerHTML = '<option value="">Select Customer</option>';

    products.forEach(function(product) {
        if (product.stock > 0) {
            const option = document.createElement("option");

            option.value = product.id;
            option.textContent =
                product.name + " - ₱" + product.sellPrice.toFixed(2);

            saleProduct.appendChild(option);
        }
    });

    customers.forEach(function(customer) {
        const option = document.createElement("option");

        option.value = customer.id;
        option.textContent = customer.name;

        utangCustomer.appendChild(option);
    });
});

function populateSaleProducts() {
    saleProduct.innerHTML = '<option value="">Select Product</option>';

    products.forEach(function(product) {
        if (product.stock > 0) {
            const option = document.createElement("option");

            option.value = product.id;
            option.textContent =
                product.name + " - ₱" + product.sellPrice.toFixed(2);

            saleProduct.appendChild(option);
        }
    });
}

addToCartButton.addEventListener("click", function() {
    const productId = Number(saleProduct.value);
    const quantity = Number(saleQuantity.value);

    const product = products.find(function(product) {
        return product.id === productId;
    });

    if (!product) {
        alert("Please select a product.");
        return;
    }

    if (product.stock === 0) {
        alert("This product is out of stock.");
        return;
    }

    if (quantity > product.stock) {
        alert("Not enough stock available.");
        return;
    }

    if (quantity <= 0) {
        alert("Enter a valid quantity.");
        return;
    }

    if (quantity > product.stock) {
        alert("Not enough stock.");
        return;
    }

    const existingItem = cart.find(function(item) {
        return item.productId === productId;
    });

    if (existingItem) {
        if (existingItem.quantity + quantity > product.stock) {
            alert("Not enough stock.");
            return;
        }

        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            quantity: quantity
        });
    }

    displayCart();

    saleQuantity.value = 1;
});

function displayCart() {
    cartTable.innerHTML = "";

    let total = 0;

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.productId;
        });

        const subtotal = product.sellPrice * item.quantity;

        total += subtotal;

        cartTable.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>${item.quantity}</td>
                <td>₱${product.sellPrice.toFixed(2)}</td>
                <td>₱${subtotal.toFixed(2)}</td>
            </tr>
        `;
    });

    saleTotal.textContent = total.toFixed(2);
}

completeSaleButton.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Cart is empty.");
        return;
    }

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.productId;
        });

        product.stock -= item.quantity;
    });

    saveProducts();

    if (paymentType.value === "utang") {
        const customerId = Number(utangCustomer.value);

        const customer = customers.find(function(customer) {
            return customer.id === customerId;
        });

        if (!customer) {
            alert("Please select a customer.");
            return;
        }

        const total = Number(saleTotal.textContent);

        customer.balance += total;

        updateDashboard();

        localStorage.setItem(
            "customers",
            JSON.stringify(customers)
        );

        alert("Sale recorded as UTANG.");
    } else {
        alert("Sale recorded as CASH.");
    }

    alert("Sale completed!");

    let saleProfit = 0;

    cart.forEach(function(item) {
        const product = products.find(function(product) {
            return product.id === item.productId;
        });

        saleProfit +=
            (product.sellPrice - product.buyPrice) *
            item.quantity;
    });

    sales.push({
        id: Date.now(),
        total: Number(saleTotal.textContent),
        profit: saleProfit,
        paymentType: paymentType.value,
        date: new Date().toISOString()
    });

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );

    cart = [];

    displayCart();
    displayProducts();
    updateDashboard();

    populateSaleProducts();
});

const dashboardButton = document.getElementById("dashboardButton");
const inventoryButton = document.getElementById("inventoryButton");

const dashboardSection = document.getElementById("dashboardSection");
const inventorySection = document.getElementById("inventorySection");

const utangButton = document.getElementById("utangButton");
const utangSection = document.getElementById("utangSection");
const addCustomerButton = document.getElementById("addCustomerButton");
const customerName = document.getElementById("customerName");
const customerTable = document.getElementById("customerTable");

dashboardButton.addEventListener("click", function() {
    dashboardSection.style.display = "block";
    inventorySection.style.display = "none";
    salesSection.style.display = "none";
    utangSection.style.display = "none";
});

inventoryButton.addEventListener("click", function() {
    dashboardSection.style.display = "none";
    inventorySection.style.display = "block";
    salesSection.style.display = "none";
    utangSection.style.display = "none";
});

newSaleButton.addEventListener("click", function() {
    dashboardSection.style.display = "none";
    inventorySection.style.display = "none";
    salesSection.style.display = "block";
    utangSection.style.display = "none";
});

utangButton.addEventListener("click", function() {
    dashboardSection.style.display = "none";
    inventorySection.style.display = "none";
    salesSection.style.display = "none";
    utangSection.style.display = "block";
    displayCustomers();
});

addCustomerButton.addEventListener("click", function() {
    const name = customerName.value.trim();

    if (name === "") {
        alert("Please enter customer name.");
        return;
    }

    const customer = {
        id: Date.now(),
        name: name,
        balance: 0
    };

    customers.push(customer);

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    customerName.value = "";

    utangCustomer.innerHTML = '<option value="">Select Customer</option>';

    customers.forEach(function(customer) {
        const option = document.createElement("option");

        option.value = customer.id;
        option.textContent = customer.name;

        utangCustomer.appendChild(option);
    });

    displayCustomers();
});

function displayCustomers() {
    customerTable.innerHTML = "";

    customers.forEach(function(customer) {
        customerTable.innerHTML += `
            <tr>
                <td>${customer.name}</td>
                <td>₱${customer.balance.toFixed(2)}</td>
                <td>
                    <button onclick="payUtang(${customer.id})">
                        Payment
                    </button>
                    <button onclick="deleteCustomer(${customer.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

function payUtang(id) {
    const customer = customers.find(function(customer) {
        return customer.id === id;
    });

    if (!customer) return;

    if (customer.balance <= 0) {
        alert("This customer has no balance.");
        return;
    }

    const payment = Number(
        prompt(
            "Enter payment amount:",
            customer.balance
        )
    );

    if (payment <= 0) {
        alert("Enter a valid payment.");
        return;
    }

    if (payment > customer.balance) {
        alert("Payment cannot be greater than the balance.");
        return;
    }

    customer.balance -= payment;

    paymentHistory.push({
        id: Date.now(),
        date: new Date().toISOString(),
        customer: customer.name,
        amount: payment,
        remaining: customer.balance
    });

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );
    localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));

    displayCustomers();
    displayPaymentHistory();
    updateDashboard();
}

function restockProduct(id) {
    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) return;

    const quantity = Number(
        prompt("Enter quantity to add:", "10")
    );

    if (quantity <= 0) {
        alert("Enter a valid quantity.");
        return;
    }

    product.stock += quantity;

    stockHistory.push({
        date: new Date().toISOString(),
        product: product.name,
        action: "Restock",
        quantity: quantity
    });

    localStorage.setItem("stockHistory", JSON.stringify(stockHistory));
    displayStockHistory();

    saveProducts();

    displayProducts();
    updateDashboard();

    alert(
        product.name +
        " restocked. New stock: " +
        product.stock
    );
}

const reportsButton = document.getElementById("reportsButton");
const reportsSection = document.getElementById("reportsSection");
const salesHistory = document.getElementById("salesHistory");

reportsButton.addEventListener("click", function() {
    dashboardSection.style.display = "none";
    inventorySection.style.display = "none";
    salesSection.style.display = "none";
    utangSection.style.display = "none";
    reportsSection.style.display = "block";

    displaySalesHistory();
});

function displaySalesHistory() {
    salesHistory.innerHTML = "";

    sales.forEach(function(sale) {
        const date = new Date(sale.date);

        const row = document.createElement("tr");
        row.dataset.date = new Date(sale.date).toISOString().split("T")[0];

        row.innerHTML = `
            <td>${date.toLocaleString()}</td>
            <td>${sale.paymentType.toUpperCase()}</td>
            <td>₱${sale.total.toFixed(2)}</td>
            <td>₱${(sale.profit || 0).toFixed(2)}</td>
        `;

        salesHistory.appendChild(row);
    });

    const reportTotalSales = sales.reduce(function(total, sale) {
        return total + Number(sale.total);
    }, 0);

    document.getElementById("reportTotalSales").textContent =
        "₱" + reportTotalSales.toFixed(2);

    const reportTotalProfit = sales.reduce(function(total, sale) {
        return total + Number(sale.profit);
    }, 0);

    document.getElementById("reportTotalProfit").textContent =
        "₱" + reportTotalProfit.toFixed(2);
}

dashboardSection.style.display = "block";
inventorySection.style.display = "none";
salesSection.style.display = "none";
utangSection.style.display = "none";
reportsSection.style.display = "none";
reportsButton.addEventListener("click", function() {
    dashboardSection.style.display = "none";
    inventorySection.style.display = "none";
    salesSection.style.display = "none";
    utangSection.style.display = "none";
    reportsSection.style.display = "block";
});

function deleteCustomer(id) {
    const customer = customers.find(function(customer) {
        return customer.id === id;
    });

    if (!customer) return;

    if (customer.balance > 0) {
        alert("Cannot delete a customer with unpaid utang.");
        return;
    }

    const confirmed = confirm(
        "Delete " + customer.name + "?"
    );

    if (!confirmed) return;

    customers = customers.filter(function(customer) {
        return customer.id !== id;
    });

    localStorage.setItem(
        "customers",
        JSON.stringify(customers)
    );

    displayCustomers();
    updateDashboard();
}

const categoryFilter = document.getElementById("categoryFilter");

function updateCategoryFilter() {
    categoryFilter.innerHTML =
        '<option value="">All Categories</option>';

    const categories = [];

    products.forEach(function(product) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    });

    categories.forEach(function(category) {
        categoryFilter.innerHTML += `
            <option value="${category}">
                ${category}
            </option>
        `;
    });
}

categoryFilter.addEventListener("change", function() {
    const category = categoryFilter.value;

    const filteredProducts = products.filter(function(product) {
        return category === "" ||
               product.category === category;
    });

    productTable.innerHTML = "";

    filteredProducts.forEach(function(product) {
        const row = document.createElement("tr");

        let status;

        if (product.stock <= product.lowStockLimit) {
            status = `<span class="status-low">⚠ Low Stock</span>`;
        } else {
            status = `<span class="status-ok">✓ OK</span>`;
        }

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.stock}</td>
            <td>₱${product.buyPrice.toFixed(2)}</td>
            <td>₱${product.sellPrice.toFixed(2)}</td>
            <td>${status}</td>
            <td>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="restockProduct(${product.id})">Restock</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;

        productTable.appendChild(row);
    });
});

updateCategoryFilter();

document.getElementById("salesDateFilter").addEventListener("change", function() {
    const selectedDate = this.value;

    const rows = document.querySelectorAll("#salesHistory tr");

    rows.forEach(function(row) {
        const saleDate = row.dataset.date;

        if (!selectedDate || saleDate === selectedDate) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

document.getElementById("clearDateFilter").addEventListener("click", function() {
    document.getElementById("salesDateFilter").value = "";

    const rows = document.querySelectorAll("#salesHistory tr");

    rows.forEach(function(row) {
        row.style.display = "";
    });
});

document.getElementById("backupButton").addEventListener("click", function() {
    const backupData = {
        products: products,
        customers: customers,
        sales: sales,
        paymentHistory: paymentHistory
    };

    const data = JSON.stringify(backupData, null, 2);
    const blob = new Blob([data], { type: "application/json" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sari-sari-store-backup.json";
    link.click();

    URL.revokeObjectURL(link.href);
});

document.getElementById("restoreButton").addEventListener("click", function() {
    const file = document.getElementById("restoreFile").files[0];

    if (!file) {
        alert("Please select a backup file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event) {
        const backupData = JSON.parse(event.target.result);

        products = backupData.products || [];
        customers = backupData.customers || [];
        sales = backupData.sales || [];
        paymentHistory = backupData.paymentHistory || [];

        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("customers", JSON.stringify(customers));
        localStorage.setItem("sales", JSON.stringify(sales));
        localStorage.setItem("paymentHistory", JSON.stringify(paymentHistory));

        displayProducts();
        displayCustomers();
        displaySalesHistory();
        displayPaymentHistory();
        updateDashboard();

        alert("Data restored successfully.");
    };

    reader.readAsText(file);
});

function displayStockHistory() {
    const stockHistoryTable = document.getElementById("stockHistory");

    stockHistoryTable.innerHTML = "";

    stockHistory.forEach(function(record) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${new Date(record.date).toLocaleString()}</td>
            <td>${record.product}</td>
            <td>${record.action}</td>
            <td>${record.quantity}</td>
        `;

        stockHistoryTable.appendChild(row);
    });
}

displayStockHistory();
document.getElementById("customerSearch").addEventListener("input", function() {
    const search = this.value.toLowerCase();
    const rows = document.querySelectorAll("#customerTable tr");

    rows.forEach(function(row) {
        const customerName = row.cells[0].textContent.toLowerCase();

        if (customerName.includes(search)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
displayProducts();
updateDashboard();
displayCustomers();
displaySalesHistory();
function displayPaymentHistory() {
    const paymentTable = document.getElementById("paymentHistory");

    paymentTable.innerHTML = "";

    paymentHistory.forEach(function(payment) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${new Date(payment.date).toLocaleString()}</td>
            <td>${payment.customer}</td>
            <td>₱${Number(payment.amount).toFixed(2)}</td>
            <td>₱${payment.remaining !== undefined ? Number(payment.remaining).toFixed(2) : "—"}</td>
            <td>
                <button onclick="deletePayment(${payment.id})">Delete</button>
            </td>
        `;

        paymentTable.appendChild(row);
    });
}

displayPaymentHistory();
function deletePayment(paymentId) {
    const payment = paymentHistory.find(function(item) {
        return item.id === paymentId;
    });

    if (!payment) {
        return;
    }

    const confirmDelete = confirm(
        "Delete this payment record and restore the amount to the customer's utang?"
    );

    if (!confirmDelete) {
        return;
    }

    const customer = customers.find(function(item) {
        return item.name === payment.customer;
    });

    if (customer) {
        customer.balance += Number(payment.amount);
        localStorage.setItem("customers", JSON.stringify(customers));
    }

    paymentHistory = paymentHistory.filter(function(item) {
        return item.id !== paymentId;
    });

    localStorage.setItem(
        "paymentHistory",
        JSON.stringify(paymentHistory)
    );

    displayPaymentHistory();
    displayCustomers();
    updateDashboard();
}
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("./service-worker.js");
    });
}