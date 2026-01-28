let cart = {};
let noTransaksi = 1;
let omzetHarian = 0;

/* ================= TAMBAH ITEM ================= */
function addItem(nama, harga) {
    if (cart[nama]) {
        cart[nama].qty += 1;
    } else {
        cart[nama] = {
            harga: harga,
            qty: 1
        };
    }
    renderCart();
}

/* ================= RENDER STRUK ================= */
function renderCart() {
    const list = document.getElementById("list");
    const listDapur = document.getElementById("listDapur");
    const totalEl = document.getElementById("total");
    const grandTotalEl = document.getElementById("grandTotal");

    list.innerHTML = "";
    listDapur.innerHTML = "";
    let total = 0;

    for (let item in cart) {
        const subtotal = cart[item].harga * cart[item].qty;
        total += subtotal;

        // STRUK CUSTOMER
        const li = document.createElement("li");
        li.textContent = `${item} x${cart[item].qty}  Rp ${subtotal.toLocaleString("id-ID")}`;
        list.appendChild(li);

        // STRUK DAPUR (TANPA HARGA)
        const liDapur = document.createElement("li");
        liDapur.textContent = `${item} x${cart[item].qty}`;
        listDapur.appendChild(liDapur);
    }

    totalEl.textContent = total.toLocaleString("id-ID");

    const diskon = parseInt(document.getElementById("diskon").value) || 0;
    const grandTotal = total - (total * diskon / 100);
    grandTotalEl.textContent = grandTotal.toLocaleString("id-ID");

    hitungKembalian();
}


/* ================= KEMBALIAN ================= */
function hitungKembalian() {
    const metode = document.getElementById("metode").value;

    if (metode !== "cash") {
        document.getElementById("kembalian").textContent = "0";
        return;
    }

    const bayar = parseInt(document.getElementById("bayar").value) || 0;
    const grandTotal = parseInt(
        document.getElementById("grandTotal").textContent.replace(/\./g, "")
    ) || 0;

    const kembalian = bayar - grandTotal;

    document.getElementById("kembalian").textContent =
        kembalian >= 0 ? kembalian.toLocaleString("id-ID") : "0";
}


function gantiMetode() {
    const metode = document.getElementById("metode").value;
    const cashBox = document.getElementById("cashBox");
    const bayar = document.getElementById("bayar");

    if (metode === "cash") {
        cashBox.style.display = "block";
        bayar.disabled = false;
        bayar.focus();
        document.getElementById("qrisInfo").style.display = "none";
    } else {
        cashBox.style.display = "none";
        bayar.value = "";
        document.getElementById("kembalian").textContent = "0";
        document.getElementById("qrisInfo").style.display = "block";
    }
}



/* ================= PRINT ================= */
function printStruk() {
    window.print();

    // simpan ke history
    simpanHistory();

    document.getElementById("thanks").style.display = "block";
}

/* ================= RESET TRANSAKSI ================= */
function resetTransaksi() {
    cart = {};
    document.getElementById("list").innerHTML = "";
    document.getElementById("total").textContent = "0";
    document.getElementById("grandTotal").textContent = "0";
    document.getElementById("kembalian").textContent = "0";
    document.getElementById("bayar").value = "";
    document.getElementById("diskon").value = 0;
    document.getElementById("thanks").style.display = "none";
    document.getElementById("noTransaksiDapur").textContent = noTransaksi;


    noTransaksi++;
    document.getElementById("noTransaksi").textContent = noTransaksi;
}

/* ================= HISTORY PENJUALAN ================= */
function simpanHistory() {
    const historyList = document.getElementById("historyList");

    for (let item in cart) {
        const subtotal = cart[item].harga * cart[item].qty;
        omzetHarian += subtotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item}</td>
            <td>${cart[item].qty}</td>
            <td>${subtotal.toLocaleString("id-ID")}</td>
        `;
        historyList.appendChild(tr);
    }

    document.getElementById("omzetHarian").textContent =
        omzetHarian.toLocaleString("id-ID");
}

/* ================= TANGGAL & JAM ================= */
function updateJam() {
    const now = new Date();
    document.getElementById("tanggalJam").textContent =
        now.toLocaleString("id-ID");
}

setInterval(updateJam, 1000);
updateJam();

document.getElementById("bayar").addEventListener("input", hitungKembalian);
document.getElementById("diskon").addEventListener("input", renderCart);
document.getElementById("metode").addEventListener("change", gantiMetode);
document.getElementById("metode").addEventListener("change", () => {
    document.getElementById("bayar").value = "";
    document.getElementById("kembalian").textContent = "0";
});
document.getElementById("kembalian").textContent =
    kembalian >= 0 ? kembalian.toLocaleString("id-ID") : "Uang Kurang";

