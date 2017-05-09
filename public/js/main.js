/**
 * Created by Suraj on 5/7/2017.
 */
function submitFilter(filter) {
    var fil = document.getElementById("filter");
    var criteria = document.getElementById("criteria");
    var filform = document.getElementById("filterForm");
    fil.value = filter;
    criteria.value = "genre";
    filform.submit();
}

function submitRatingFilter(filter) {
    var fil = document.getElementById("filter");
    var criteria = document.getElementById("criteria");
    var filform = document.getElementById("filterForm");
    fil.value = filter;
    criteria.value = "rating";
    filform.submit();
}

function changeCategory(category) {
    var Category = document.getElementById("category");
    Category.innerHTML = category+" <span class='caret'></span>";
    document.getElementById("criteria").value= category.split(" ")[1].toLowerCase();
    //alert(document.getElementById("criteria").value);
}

function callSearch() {
    var keyword = document.getElementById("searchKeyword").value;
    var fil = document.getElementById("filter");
    var filform = document.getElementById("filterForm");
    fil.value = keyword;
    //alert(keyword);
    filform.submit();
}

function addToCart(id) {
    var addtocartForm = document.getElementById("addtocartForm");
    var bookId = document.getElementById("bookId");
    var message = document.getElementById("alertMessage");
    message.style.display = "block";
    bookId.value = id;
    addtocartForm.submit();
}