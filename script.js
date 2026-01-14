let list = document.getElementById("list");
let totalText = document.getElementById("total");
let grandTotalText = document.getElementById("grandTotal");
let kembalianText = document.getElementById("kembalian");

let total = 0;
let grandTotalAngka = 0;
let nomor = 1;

// ================= HEADER =================
function updateHeader() {
    let now = new Date();
    let tanggal = now.toLocaleDateString("id-ID");
    let jam = now.toLocaleTimeString("id-ID");

    document.getElementById("noTransaksi").textContent = nomor;
    document.getElementById("tanggalJam").textContent =
        "Tanggal: " + tanggal + " | Jam: " + jam;
}
updateHeader();

// ================= FORMAT =================
function formatRupiah(angka) {
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ================= TOTAL & DISKON =================
function hitungTotal() {
    let diskon = parseInt(document.getElementById("diskon").value) || 0;

    let potongan = total * (diskon / 100);
    grandTotalAngka = total - potongan;

    totalText.textContent = formatRupiah(total);
    grandTotalText.textContent = formatRupiah(Math.round(grandTotalAngka));

    hitungKembalian();
}

// ================= KEMBALIAN =================
function hitungKembalian() {
    let metode = document.getElementById("metode").value;

    // Jika QRIS → tidak ada kembalian
    if (metode === "qris") {
        kembalianText.textContent = "0";
        return;
    }

    let bayar = parseInt(document.getElementById("bayar").value);

    if (isNaN(bayar)) {
        kembalianText.textContent = "0";
        return;
    }

    let selisih = bayar - Math.round(grandTotalAngka);

    if (selisih < 0) {
        kembalianText.textContent = "Kurang Rp " + formatRupiah(Math.abs(selisih));
    } else {
        kembalianText.textContent = formatRupiah(selisih);
    }
}

// ================= TAMBAH ITEM =================
function addItem(nama, harga, inputId) {
    let qty = parseInt(document.getElementById(inputId).value);

    if (isNaN(qty) || qty <= 0) {
        alert("Jumlah harus lebih dari 0");
        return;
    }

    let subtotal = harga * qty;

    let li = document.createElement("li");
    li.innerHTML = `
        ${nama} x ${qty} = Rp ${formatRupiah(subtotal)}
        <button onclick="hapusItem(this, ${subtotal})">❌</button>
    `;

    list.appendChild(li);

    total += subtotal;
    hitungTotal();
}

// ================= HAPUS ITEM =================
function hapusItem(button, subtotal) {
    button.parentElement.remove();
    total -= subtotal;
    if (total < 0) total = 0;
    hitungTotal();
}

// ================= EVENT =================
document.getElementById("diskon").addEventListener("input", hitungTotal);
document.getElementById("bayar").addEventListener("input", hitungKembalian);

// Event metode pembayaran
document.getElementById("metode").addEventListener("change", function () {
    let metode = this.value;

    if (metode === "qris") {
        document.getElementById("cashBox").style.display = "none";
        document.getElementById("qrisInfo").style.display = "block";
        document.getElementById("bayar").value = "";
        kembalianText.textContent = "0";
    } else {
        document.getElementById("cashBox").style.display = "block";
        document.getElementById("qrisInfo").style.display = "none";
    }
});

// ================= PRINT =================
function printStruk() {
    window.print();
}

// ================= RESET =================
function resetTransaksi() {
    list.innerHTML = "";

    total = 0;
    grandTotalAngka = 0;

    totalText.textContent = "0";
    grandTotalText.textContent = "0";
    kembalianText.textContent = "0";

    document.getElementById("diskon").value = "";
    document.getElementById("bayar").value = "";
    document.getElementById("metode").value = "cash";
    document.getElementById("cashBox").style.display = "block";
    document.getElementById("qrisInfo").style.display = "none";

    nomor++;
    updateHeader();
}
