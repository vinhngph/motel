function nextModal(prevId, nextId) {
    document.getElementById(prevId).setAttribute("hidden", "");
    document.getElementById(nextId).removeAttribute("hidden");
}

function prevModal(prevId, currentId) {
    document.getElementById(currentId).setAttribute("hidden", "");
    document.getElementById(prevId).removeAttribute("hidden");
}

function notification(step, msg) {
    const container = document.querySelector(`.${step}.notification`);

    const content = document.createElement("div");
    content.className = "alert alert-danger mt-3 mb-3";
    content.role = "alert";
    content.innerText = msg;

    container.childNodes.forEach(e => e.remove());
    container.appendChild(content);

    setTimeout(() => {
        content.remove();
    }, 3000);
}

function processDien() {
    const step = "dien";

    const soDienCu = document.getElementById("so-dien-cu").value;

    if (soDienCu === "") return notification(step, "Chưa nhập số điện cũ!");
    if (Number(soDienCu) < 0) return notification(step, "Số điện lớn hơn hoặc bằng 0!");

    const soDienMoi = document.getElementById("so-dien-moi").value;
    if (soDienMoi === "") return notification(step, "Chưa nhập số điện mới!");
    if (Number(soDienMoi) < 0) return notification(step, "Số điện lớn hơn hoặc bằng 0!");

    if (!Number.isInteger(Number(soDienCu)) || !Number.isInteger(Number(soDienMoi))) return notification(step, "Số điện phải là số nguyên!");

    if (Number(soDienMoi) - Number(soDienCu) <= 0) return notification(step, "Số điện mới phải lớn hơn số điện cũ!");

    nextModal("modal-dien", "modal-nuoc");
}

function processNuoc() {
    const step = "nuoc";

    const soNuocCu = document.getElementById("so-nuoc-cu").value;
    if (soNuocCu === "") return notification(step, "Chưa nhập số nước cũ!");
    if (Number(soNuocCu) < 0) return notification(step, "Số nước lớn hơn hoặc bằng 0!");

    const soNuocMoi = document.getElementById("so-nuoc-moi").value;
    if (soNuocMoi === "") return notification(step, "Chưa nhập số nước mới!");
    if (Number(soNuocMoi) < 0) return notification(step, "Số nước lớn hơn hoặc bằng 0!");

    if (!Number.isInteger(Number(soNuocCu)) || !Number.isInteger(Number(soNuocMoi))) return notification(step, "Số nước phải là số nguyên!");

    if (Number(soNuocMoi) - Number(soNuocCu) <= 0) return notification(step, "Số nước mới phải lớn hơn số nước cũ!");

    nextModal("modal-nuoc", "modal-rac");
}

function processGiaThueChoice(element) {
    if (element.classList.contains("active")) return;

    element.classList.add("active");

    const choices = document.querySelectorAll(".gia-thue-choice");

    for (const e of choices) {
        if (e === element) continue;

        e.classList.remove("active");
    }
}

function parseVND(num) {
    return num.toLocaleString("vi-VN");
}

function calculatingResult() {
    const DIEN_RATE = 3500;
    const NUOC_RATE = 3500;
    const RAC_RATE = 3500;

    const soDienCu = document.getElementById("so-dien-cu").value;
    const soDienMoi = document.getElementById("so-dien-moi").value;
    const soDien = (Number(soDienMoi) - Number(soDienCu));
    const tienDien = soDien * DIEN_RATE;

    const soNuocCu = document.getElementById("so-nuoc-cu").value;
    const soNuocMoi = document.getElementById("so-nuoc-moi").value;
    const soNuoc = Number(soNuocMoi) - Number(soNuocCu);
    const tienNuoc = soNuoc * NUOC_RATE;

    const tienThue = Number(document.querySelector(".gia-thue-choice.active").innerText.replace(/\./g, ""));

    const tong = tienDien + tienNuoc + RAC_RATE + tienThue;

    const now = new Date();
    document.getElementById("bill-date").innerText = `${now.toLocaleTimeString("vi-VN")} - ${now.toLocaleDateString("vi-VN")}`;

    document.getElementById("bill-so-dien").innerText = soDien;
    document.getElementById("bill-tien-dien").value = parseVND(tienDien);

    document.getElementById("bill-so-nuoc").innerText = soNuoc;
    document.getElementById("bill-tien-nuoc").value = parseVND(tienNuoc);

    document.getElementById("bill-tien-rac").value = parseVND(RAC_RATE);
    document.getElementById("bill-tien-thue").value = parseVND(tienThue);

    document.getElementById("bill-tong").value = parseVND(tong);

    nextModal("modal-thue", "modal-bill");
}

function processGiaThue() {
    const step = "thue";

    const choice = document.querySelector(".gia-thue-choice.active");
    if (!choice) return notification(step, "Chưa chọn giá thuê!");

    calculatingResult();
}

function reset() {
    document.getElementById("so-dien-cu").value = "";
    document.getElementById("so-dien-moi").value = "";

    document.getElementById("so-nuoc-cu").value = "";
    document.getElementById("so-nuoc-moi").value = "";

    document.querySelector(".gia-thue-choice.active").classList.remove("active");

    nextModal("modal-bill", "modal-dien");
}