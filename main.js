// // // // main.js
// // register.js


document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = document.getElementById('text').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        document.getElementById('errorMessage').textContent = 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين.';
        document.getElementById('errorMessage').style.display = 'block';
        return;
    }

    const newUser = {
        text: text,
        email: email,
        password: password
    };

    // جلب المستخدمين المخزنين أو تعيين مصفوفة فارغة إذا لم تكن موجودة
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
    window.location.href = 'login.html';
});

// تسجيل الدخول
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        document.getElementById('errorMessage').textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
        document.getElementById('errorMessage').style.display = 'block';
    }
});

// وظيفة البحث
window.performSearch = function(event) {
    event.preventDefault(); // منع إعادة تحميل الصفحة
    
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery)
    );

    displayProducts(filteredProducts);
};

// عرض المنتجات
function displayProducts(filteredProducts) {
    const products = filteredProducts || JSON.parse(localStorage.getItem('products')) || [];
    const productsList = document.getElementById('productsList');
    productsList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productDiv.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.textContent = product.name;
        productDiv.appendChild(productName);

        const productPrice = document.createElement('p');
        productPrice.textContent = `السعر: ${product.price} $`;
        productDiv.appendChild(productPrice);

        const DescribtionProduct = document.createElement('p');
        DescribtionProduct.textContent = `الوصف: ${product.DescribtionProduct}`;
        productDiv.appendChild(DescribtionProduct);

        const productSeller = document.createElement('p');
        productSeller.textContent = `البائع: ${product.seller}`;
        productDiv.appendChild(productSeller);

        const phonestatue = document.createElement('p');
        phonestatue.textContent = `حالة الجهاز: ${product.statue}`;
        productDiv.appendChild(phonestatue);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.addEventListener('click', function() {
            deleteProduct(product.id);
        });
        productDiv.appendChild(deleteButton);

        // رابط "عرض التفاصيل"
        const detailsLink = document.createElement('a');
        detailsLink.href = `product-details.html?id=${product.id}`;
        detailsLink.textContent = 'المزيد';
        detailsLink.classList.add('details-link');
        detailsLink.style.textDecoration = "none";
        detailsLink.style.border = "2px solid black";
        detailsLink.style.padding = "5px";
        detailsLink.style.backgroundColor = "#8ddcf4";
        detailsLink.style.color = "dimgrey";
        productDiv.appendChild(detailsLink);

        // إضافة زر "شراء الآن"
        const buyButton = document.createElement('button');
        buyButton.textContent = 'شراء الآن';
        buyButton.addEventListener('click', function() {
            const whatsappNumber = product.phonenumber;
            const message = `أريد شراء المنتج ${product.name} بسعر ${product.price}$.`;
            const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
        productDiv.appendChild(buyButton);

        productsList.appendChild(productDiv);
    });
}

// حذف منتج
function deleteProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    displayProducts();
}

// تحميل المنتجات عند فتح الصفحة
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { text: 'مستخدم مجهول' };

    // إضافة منتج جديد
    document.getElementById('productForm')?.addEventListener('submit', function(e) {
        e.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const DescribtionProduct = document.getElementById('DescribtionProduct').value;
        const phonestatue = document.getElementById('phonestatue').value;
        const productImage = document.getElementById('productImage').files[0];
        const phonenumber = document.getElementById('phonenumber') ? document.getElementById('phonenumber').value : '';

        if (!productName || !productPrice || !DescribtionProduct || !phonestatue || !productImage) {
            console.error('يرجى ملء جميع الحقول');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const newProduct = {
                id: Date.now(), // Unique ID
                name: productName,
                price: productPrice,
                DescribtionProduct: DescribtionProduct,
                statue: phonestatue,
                image: event.target.result,
                seller: currentUser.text,
                phonenumber: phonenumber
            };

            const products = JSON.parse(localStorage.getItem('products')) || [];
            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            document.getElementById('productForm').reset();
            displayProducts();
        };
        reader.readAsDataURL(productImage);
    });

    // عرض المنتجات عند تحميل الصفحة
    displayProducts();
});
document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    // بيانات المنتجات
    const products = [
        {
            name: 'realme c53',
            description: 'realmec53 dual sim phone 256GB rom and 8 ram 4G',
            price: '$105',
            image: 'img/realme.png',
            state:' new'
        },
        {
            name: 'realme GT 6T',
            description: 'Realme GT 6T 256GB ROM 12GB RAM 5G',
            price: '$120',
            image: 'img/gt.png',
            state:' new'

        },
        {
            name: 'realme 11',
            description: 'realme 11 256GB ROM 8 GB RAM 5G',
            price: '$160',
            image: 'img/11.png' ,            
            state:' new'

        }, {
            name: 'realme note 50',
            description: 'realme note 50 64GB ROM 3GB RAM 4G',
            price: '$100',
            image: 'img/not 50.png'
        }, {
            name: 'iphone 14 plus',
            description: 'iphone 14 plus 128 GB color black                                                ',
            price: '$450',
            image: 'img/iphone 14.png',
            state:' used'

        }, {
            name: 'iphone 15',
            description: 'iphone 15 128GB dual sim phone color green ',
            price: '$350',
            image: 'img/iphone15.png',
            state:' used'

        }, {
            name: 'iphone 13',
            description: 'iphone 13 128GB dual sim phone color white  ',
            price: '$300',
            image: 'img/iphone13.png',
            state:' new'

        }, {
            name: 'iphone 11',
            description: 'iphone 128GB ROM 4GB RAM color white',
            price: '$400',
            image: 'img/iphone12.png',
            state:' new'

        }
        // يمكنك إضافة المزيد من المنتجات هنا
    ];

    // إنشاء بطاقة منتج
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                
                <p class="price">${product.state}</p>
                <p class="price">${product.price}</p>

<a href="https://wa.me/1234567890" class="btn">Buy Now</a>
            </div>
        `;

        return card;
    }

    // إضافة بطاقات المنتجات إلى القائمة
    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard);
    });
});

