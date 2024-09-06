document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // استرجاع بيانات المنتج
    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) {
        document.body.innerHTML = '<h1>المنتج غير موجود</h1>';
        return; // الخروج مبكرًا إذا لم يكن هناك معرف منتج
    }

    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id == productId);

    if (product) {
        // عرض تفاصيل المنتج
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productPrice').textContent = `price: ${product.price} $`;
        document.getElementById('productDescription').textContent = `descrption: ${product.DescribtionProduct}`;
        document.getElementById('productStatue').textContent = `devicestatus : ${product.statue}`;
        document.getElementById('productImage').src = product.image;

        // إعداد روابط التواصل
        document.getElementById('whatsappLink').href = `https://wa.me/${product.phonenumber}?text=${encodeURIComponent('استفسار حول المنتج')}`;
        document.getElementById('emailLink').href = `mailto:seller@example.com`;

        // عرض التقييمات
        displayReviews(productId);

        // إضافة تعليق جديد
        document.getElementById('commentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const commentText = document.getElementById('comment').value.trim();
            if (commentText) {
                const newComment = {
                    id: Date.now(),
                    productId: productId,
                    text: commentText,
                    user: currentUser ? currentUser.text : 'مستخدم مجهول'
                };
                const comments = JSON.parse(localStorage.getItem('comments')) || [];
                comments.push(newComment);
                localStorage.setItem('comments', JSON.stringify(comments));
                document.getElementById('commentForm').reset();
                displayReviews(productId);
            } else {
                alert('يرجى إدخال تعليق قبل الإرسال.');
            }
        });

        // نموذج الاتصال
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            if (name && email && message) {
                // هنا يمكن إرسال البيانات إلى البائع عبر البريد الإلكتروني أو أي طريقة أخرى
                alert('شكراً على رسالتك! سنقوم بالرد عليك قريباً.');
                document.getElementById('contactForm').reset();
            } else {
                alert('يرجى ملء جميع الحقول قبل الإرسال.');
            }
        });
    } else {
        document.body.innerHTML = '<h1>المنتج غير موجود</h1>';
    }

    function displayReviews(productId) {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        const productReviews = comments.filter(c => c.productId == productId);
        const reviewsList = document.getElementById('reviewsList');
        reviewsList.innerHTML = '';
        
        productReviews.forEach(comment => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');

            const user = document.createElement('h3');
            user.textContent = comment.user;
            reviewDiv.appendChild(user);

            const text = document.createElement('p');
            text.textContent = comment.text;
            reviewDiv.appendChild(text);

            // إضافة زر حذف التقييم
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'حذف';
            deleteButton.addEventListener('click', function() {
                if (confirm('هل أنت متأكد من حذف هذا التعليق؟')) {
                    deleteComment(comment.id);
                }
            });
            reviewDiv.appendChild(deleteButton);

            reviewsList.appendChild(reviewDiv);
        });
    }

    function deleteComment(commentId) {
        let comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments = comments.filter(comment => comment.id !== commentId);
        localStorage.setItem('comments', JSON.stringify(comments));
        displayReviews(productId);
    }
});