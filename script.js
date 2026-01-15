let list = document.getElementById("list");
let totalText = document.getElementById("total");
let grandTotalText = document.getElementById("grandTotal");
let kembalianText = document.getElementById("kembalian");

let total = 0;
let grandTotalAngka = 0;
let nomor = 1;

// Header
function updateHeader(){
    let now = new Date();
    document.getElementById("noTransaksi").textContent = nomor;
    document.getElementById("tanggalJam").textContent =
        now.toLocaleDateString("id-ID") + " " + now.toLocaleTimeString("id-ID");
}
updateHeader();

function formatRupiah(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".");
}

// Hitung total
function hitungTotal(){
    let diskon = parseInt(document.getElementById("diskon").value) || 0;
    grandTotalAngka = total - (total * diskon / 100);

    totalText.textContent = formatRupiah(total);
    grandTotalText.textContent = formatRupiah(grandTotalAngka);

    hitungKembalian();
}

// Hitung kembalian
function hitungKembalian(){
    if(document.getElementById("metode").value === "qris"){
        kembalianText.textContent = "0";
        return;
    }
    let bayar = parseInt(document.getElementById("bayar").value) || 0;
    let selisih = bayar - grandTotalAngka;

    kembalianText.textContent = selisih < 0
        ? "Kurang Rp " + formatRupiah(-selisih)
        : formatRupiah(selisih);
}

// Tambah item
function addItem(nama,harga,id){
    let qty = parseInt(document.getElementById(id).value);
    let subtotal = harga * qty;

    total += subtotal;
    list.innerHTML += `<li>${nama} x ${qty} = Rp ${formatRupiah(subtotal)}</li>`;
    hitungTotal();
}

// Reset
function resetTransaksi(){
    list.innerHTML = "";
    total = 0;
    grandTotalAngka = 0;

    document.getElementById("bayar").value = "";
    document.getElementById("diskon").value = 0;
    document.getElementById("kembalian").textContent = "0";
    document.getElementById("qrisInfo").style.display = "none";
    document.getElementById("thanks").style.display = "none";

    nomor++;
    updateHeader();
    hitungTotal();
}

// Print
function printStruk(){
    document.getElementById("thanks").style.display = "block";
    window.print();
}

// Realtime update
document.getElementById("diskon").addEventListener("input", hitungTotal);
document.getElementById("bayar").addEventListener("input", hitungKembalian);
document.getElementById("metode").addEventListener("change", function(){
    document.getElementById("qrisInfo").style.display =
        this.value === "qris" ? "block" : "none";
    hitungKembalian();
});

// Search
document.getElementById("searchMenu").addEventListener("input",function(){
    let k = this.value.toLowerCase();
    document.querySelectorAll(".menu-item").forEach(i=>{
        i.style.display = i.textContent.toLowerCase().includes(k) ? "block" : "none";
    });
});

// Kategori
function filterKategori(k){
    document.querySelectorAll(".menu-item").forEach(i=>{
        i.style.display = (k==="all" || i.classList.contains(k)) ? "block" : "none";
    });
}
