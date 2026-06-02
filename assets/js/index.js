const NUOC_RATE = 3000;

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

    container.childNodes.forEach((e) => e.remove());
    container.appendChild(content);

    setTimeout(() => {
        content.remove();
    }, 3000);
}

function processDien() {
    const step = "dien";

    const giaDien = document.getElementById("gia-dien").value.replace(/\D/g, "");
    if (Number(giaDien) <= 0)
        return notification(step, "Giá điện phải lớn hơn 0!");

    const soDienCu = document.getElementById("so-dien-cu").value;

    if (soDienCu === "") return notification(step, "Chưa nhập số điện cũ!");
    if (Number(soDienCu) < 0)
        return notification(step, "Số điện lớn hơn hoặc bằng 0!");

    const soDienMoi = document.getElementById("so-dien-moi").value;
    if (soDienMoi === "") return notification(step, "Chưa nhập số điện mới!");
    if (Number(soDienMoi) < 0)
        return notification(step, "Số điện lớn hơn hoặc bằng 0!");

    if (
        !Number.isInteger(Number(soDienCu)) ||
        !Number.isInteger(Number(soDienMoi))
    )
        return notification(step, "Số điện phải là số nguyên!");

    if (Number(soDienMoi) - Number(soDienCu) <= 0)
        return notification(step, "Số điện mới phải lớn hơn số điện cũ!");

    nextModal("modal-dien", "modal-nuoc");
}

function processNuoc() {
    const step = "nuoc";

    const soNuocCu = document.getElementById("so-nuoc-cu").value;
    if (soNuocCu !== "") {
        if (Number(soNuocCu) < 0)
            return notification(step, "Số nước lớn hơn hoặc bằng 0!");
    }

    const soNuocMoi = document.getElementById("so-nuoc-moi").value;
    if (soNuocMoi !== "") {
        if (Number(soNuocMoi) < 0)
            return notification(step, "Số nước lớn hơn hoặc bằng 0!");
    }

    if (soNuocCu !== "" && soNuocMoi !== "") {
        if (
            !Number.isInteger(Number(soNuocCu)) ||
            !Number.isInteger(Number(soNuocMoi))
        )
            return notification(step, "Số nước phải là số nguyên!");
        if (Number(soNuocMoi) - Number(soNuocCu) <= 0)
            return notification(step, "Số nước mới phải lớn hơn số nước cũ!");
    }

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

function processGiaNuocChoice(element) {
    element.classList.contains("active")
        ? element.classList.remove("active")
        : element.classList.add("active");

    const choices = document.querySelectorAll(".gia-nuoc-choice");

    for (const e of choices) {
        if (e === element) continue;

        e.classList.remove("active");
    }

    document.querySelector("#so-nuoc-cu").value = "";
    document.querySelector("#so-nuoc-moi").value = "";
}

function processTienRac(element) {
    element.classList.contains("active")
        ? element.classList.remove("active")
        : element.classList.add("active");
}

function parseVNDWithStyle(num) {
    const vndFormatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    return vndFormatter.format(num);
}

function parseVND(num) {
    const vndFormatter = new Intl.NumberFormat("vi-VN");

    return vndFormatter.format(num);
}

function addingRow(loai, cu, moi, gia) {
    const table = document.getElementById("bill-table");
    const tr = document.createElement("tr");

    const loaiNode = document.createElement("th");
    loaiNode.scope = "row";
    loaiNode.innerText = loai;
    tr.appendChild(loaiNode);

    const cuNode = document.createElement("td");
    cuNode.innerText = cu;
    tr.appendChild(cuNode);

    const moiNode = document.createElement("td");
    moiNode.innerText = Number.isInteger(moi) ? moi : moi.toFixed(2);
    tr.appendChild(moiNode);

    const soLuongNode = document.createElement("td");
    soLuongNode.innerText = Number.isInteger(moi)
        ? moi - cu
        : (moi - cu).toFixed(2);
    tr.appendChild(soLuongNode);

    const giaNode = document.createElement("td");
    giaNode.innerText = parseVND(gia);
    giaNode.className = "text-end";
    tr.appendChild(giaNode);

    const tongNode = document.createElement("td");
    tongNode.innerText = parseVNDWithStyle(gia * (moi - cu));
    tongNode.className = "text-end";
    tr.appendChild(tongNode);

    table.appendChild(tr);
}

function addingFinalRow(...data) {
    const table = document.getElementById("bill-table");
    const tr = document.createElement("tr");

    const tenNode = document.createElement("th");
    tenNode.scope = "row";
    tenNode.colSpan = "5";
    tenNode.className = "text-center";
    tenNode.innerText = "Tổng cộng";
    tr.appendChild(tenNode);

    const tongNode = document.createElement("td");
    tongNode.className = "text-end";
    tongNode.innerText = parseVNDWithStyle(
        data.reduce((acc, curr) => acc + curr, 0),
    );
    tr.appendChild(tongNode);

    table.appendChild(tr);
}

function calculatingResult() {
    const giaDien = document.getElementById("gia-dien").value.replace(/\D/g, "");
    const soDienCu = document.getElementById("so-dien-cu").value;
    const soDienMoi = document.getElementById("so-dien-moi").value;

    const soDien = Number(soDienMoi) - Number(soDienCu);
    const tienDien = soDien * Number(giaDien);

    const soNuocCu = document.getElementById("so-nuoc-cu").value;
    let soNuocMoi = document.getElementById("so-nuoc-moi").value;

    let soNuoc = Number(soNuocMoi) - Number(soNuocCu);
    if (soNuoc === 0) {
        const nuocEl = document.querySelector(".gia-nuoc-choice.active");
        if (nuocEl) {
            const giaNuocSpecial = Number(nuocEl.innerText.replace(/\./g, ""));
            soNuoc = giaNuocSpecial / NUOC_RATE;
            soNuocMoi = soNuoc;
        }
    }
    const tienNuoc = soNuoc * NUOC_RATE;

    const tienThue = Number(
        document
            .querySelector(".gia-thue-choice.active")
            .innerText.replace(/\./g, ""),
    );

    const tienRacEl = document.querySelector(".tien-rac.active");
    const tienRac = tienRacEl
        ? Number(tienRacEl.innerText.replace(/\./g, ""))
        : 0;

    const now = new Date();
    document.getElementById("bill-date").innerText =
        `${now.toLocaleTimeString("vi-VN")} - ${now.toLocaleDateString("vi-VN")}`;

    if (soDien > 0)
        addingRow("Điện", Number(soDienCu), Number(soDienMoi), giaDien);
    if (soNuoc > 0)
        addingRow("Nước", Number(soNuocCu), Number(soNuocMoi), NUOC_RATE);
    if (tienRacEl) addingRow("Rác", 0, 1, tienRac);
    if (tienThue) addingRow("Thuê", 0, 1, tienThue);

    addingFinalRow(tienDien, tienNuoc, tienRac, tienThue);

    nextModal("modal-thue", "modal-bill");
}

function processGiaThue() {
    const step = "thue";

    const choice = document.querySelector(".gia-thue-choice.active");
    if (!choice) return notification(step, "Chưa chọn giá thuê!");

    calculatingResult();
}

async function captureAndShare() {
    try {
        const date = document.getElementById("bill-date").innerText;
        const canvas = await html2canvas(document.getElementById("card-bill"));

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const imageFile = new File([blob], `${date}.png`, {
                type: "image/png",
            });

            const shareData = {
                title: `Hoá đơn ${date}`,
                files: [imageFile],
            };

            if (navigator.canShare && navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error(err);
                }
            } else {
                alert("Không share được!");
            }
        }, "image/png");
    } catch (err) {
        console.error(err);
    }
}

function reset() {
    document.getElementById("so-dien-cu").value = "";
    document.getElementById("so-dien-moi").value = "";

    document.getElementById("so-nuoc-cu").value = "";
    document.getElementById("so-nuoc-moi").value = "";
    document
        .querySelector(".gia-nuoc-choice.active")
        ?.classList.remove("active");

    document
        .querySelector(".gia-thue-choice.active")
        ?.classList.remove("active");
    document.querySelector(".tien-rac.active")?.classList.remove("active");

    document.querySelector("#bill-table").replaceChildren();

    nextModal("modal-bill", "modal-dien");
}

document.querySelector("#so-nuoc-cu").addEventListener("input", (e) => {
    document.querySelectorAll(".gia-nuoc-choice").forEach((e) => {
        e.classList.remove("active");
    });
});

document.querySelector("#so-nuoc-moi").addEventListener("input", (e) => {
    document.querySelectorAll(".gia-nuoc-choice").forEach((e) => {
        e.classList.remove("active");
    });
});

document.querySelector("#gia-dien").addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value === "") {
        e.target.value = "";
        return;
    }
    e.target.value = Number(value).toLocaleString("vi-VN");
});
