#!/usr/bin/env python3
import datetime
import json
import os
import ssl
import sys
import urllib.parse
import urllib.request

BASE = "https://vp.phuwaco.com.vn:4432/api/ThongTinDashboard/"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.js")
CTX = ssl.create_default_context()


def get(path, **params):
    url = BASE + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    try:
        with urllib.request.urlopen(url, timeout=60, context=CTX) as r:
            return json.loads(r.read().decode("utf-8"))
    except Exception as e:
        print(f"  ! {path}: {e}", file=sys.stderr)
        return None


def main():
    now = datetime.datetime.now()
    nam = str(int(sys.argv[1]) if len(sys.argv) > 1 else now.year)
    y = {"Nam": nam}

    d = {}
    d["ttnNam"] = get("ThatThoatNuocTheoNam", **y) or []
    kys = [int(x["KY"]) for x in d["ttnNam"] if x.get("KY")]
    ky = str(max(kys) if kys else max(now.month - 1, 1))

    plan = {
        "kh": ("ThongTinSoLuongKHMoi", {}),
        "sanLuong": ("ThongTinSanLuong", y),
        "doanhThu": ("ThongTinDoanhThu", y),
        "tyLeThucThu": ("ThongTinTyLeThucThu", y),
        "ttn": ("ThongTinThatThoatNuoc", y),
        "gbbq": ("ThongTinGiaBanBQ", y),
        "thuHo": ("ThongTinThuHoTienNuoc", y),
        "cccd": ("ThongTinDinhDanhCCCD", {}),
        "cccdPhuong": ("ThongTinDinhDanhCCCDTheoPhuong", y),
        "ganMoi": ("ThongTinGanMoi", y),
        "ganMoiPhuong": ("ThongTinGanMoiDHNChiTietTheoPhuong", y),
        "ganMoiCo": ("ThongTinGanMoiDHNChiTietTheoCoDHN", y),
        "doi": ("ThongTinNangDoi", y),
        "doiPhuong": ("ThongTinNangDoiDHNChiTietTheoPhuong", y),
        "thayNho": ("ThongTinThayDHNCoNho", y),
        "thayLon": ("ThongTinThayDHNCoLon", y),
        "thayNhoPhuong": ("ThongTinThayDHNCoNhoChiTietTheoPhuong", y),
        "thayLonPhuong": ("ThongTinThayDHNCoLonChiTietTheoPhuong", y),
        "dvkh": ("BieuDoHoSoDVKH", {}),
        "ktks": ("BieuDoHoSoKTKS", {}),
        "dvkhCXL": ("ThongTinDonPhanAnhDVKHCXLChiTiet",
                    {"Tungay": f"01-01-{nam}", "Denngay": now.strftime("%d-%m-%Y"), "NOIDUNG": ""}),
        "app": ("ThongTinCaiDatAppSawaco", {}),
        "hoanCong": ("ThongTinHoanCongSuaBe", y),
        "bdSanLuong": ("BieuDoSanLuong", {}),
        "bdDoanhThu": ("BieuDoDoanhThu", {}),
        "bdGBBQ": ("BieuDoGiaBanBinhQuan", {}),
        "bdThuHo": ("BieuDoThuHoTienNuoc", {}),
        "hd0": ("BieuDoHoaDon0", {}),
        "hd14": ("BieuDoHoaDon1_4", {}),
        "bdTTN": ("BieuDoThatThoatNuoc", {}),
        "ttnVung": ("ThongTinTyLeTTNVungTheoKy", y),
        "nguyenNhanBe": ("ThongTinNguyenNhanDiemBeChiTiet", y),
        "dtDot": ("ThongTinDoanhThuChiTietNew", {"Nam": nam, "Ky": ky, "Phuong": ""}),
    }
    for key, (path, params) in plan.items():
        print(f"- {key}")
        d[key] = get(path, **params)

    d["kyDma"] = d["kyChuanThu"] = None
    for k in range(int(ky), 0, -1):
        if d.get("dma") is None or not any(float(x.get("SO_DMA") or 0) for x in d["dma"]):
            print(f"- dma kỳ {k}")
            d["dma"], d["kyDma"] = get("ThongTinBieuDoTTNDMATheoKhoang", Nam=nam, Ky=str(k)), str(k)
        if not d.get("ttnChuanThu"):
            print(f"- ttnChuanThu kỳ {k}")
            d["ttnChuanThu"], d["kyChuanThu"] = get("ThongTinTongQuanTTNChuanThu", Ky=str(k), Chuanthu="1"), str(k)
        if d["ttnChuanThu"] and any(float(x.get("SO_DMA") or 0) for x in d["dma"] or []):
            break

    d["_meta"] = {"nam": nam, "ky": ky, "fetchedAt": now.strftime("%d/%m/%Y %H:%M")}
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("window.REPORT_DATA = ")
        json.dump(d, f, ensure_ascii=False)
        f.write(";\n")
    print(f"Đã ghi {OUT} (năm {nam}, kỳ {ky})")


if __name__ == "__main__":
    main()
