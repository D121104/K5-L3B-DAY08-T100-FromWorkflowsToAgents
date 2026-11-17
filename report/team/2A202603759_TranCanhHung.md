# Báo cáo cá nhân — Trần Cảnh Hưng

## 1. Thông tin thành viên

- Họ tên: Trần Cảnh Hưng
- MSSV: 2A202603759
- Email: hungtch.work@gmail.com
- GitHub: danialtranz
- Nhánh chính: `member-04/orchestrator`

## 2. Phần việc phụ trách

- Shape C **orchestrator / investigator** theo T008–T009.
- File chính: `src/lab8/shapes/orchestrator.py`, `src/tests/test_orchestrator_shape.py`.
- Phụ: demo FE Claim Flow Studio (`src/web/`) và API HTTP nối backend thật (`src/lab8/web_api.py`) để nhóm quan sát luồng chạy claim trên canvas.

## 3. Đóng góp cụ thể

### 3.1 Shape C orchestrator (bắt buộc)

- Commit `d4e1899` — *Implement Shape C orchestrator with dedicated regression tests (T008/T009).*
- Triển khai `run_claim` cho orchestrator:
  - Tạo handoff bằng `lab8.handoff.make_handoff` (allowlist, không đưa `parent_secret` / raw headers / full claim).
  - Investigator chỉ chạy tool đọc qua `run_readonly_investigators`.
  - Orchestrator tính quote từ order view và gọi `durability.issue_refund` với **full quote**.
  - Truyền `crash_at`, **không bắt** `InjectedCrash`.
  - Trace ghi handoff đã sanitize, investigator summary, quote; không dump secret/PII.
- Thêm regression tests riêng trong `src/tests/test_orchestrator_shape.py` (handoff allowlist, worker không ghi refund, kết quả claim, secret leak, crash/resume…).

### 3.2 Demo studio (bổ sung)

- Commit `428cbab` — scaffold React + Vite + React Flow canvas (chọn shape/claim, animate bước, panel thu gọn, fullscreen).
- Commit `20fb638` — API `lab8.web_api` (`/api/health`, `/api/claims`, `/api/shapes`, `/api/run`) gọi `run_shape` thật; FE replay theo trace + Step journal từng bước.
- Commit `0555d56` — cập nhật `.gitignore` liên quan workspace demo.

## 4. Bằng chứng

### Commit

| Hash | Nội dung |
| --- | --- |
| `d4e1899` | Shape C orchestrator + `test_orchestrator_shape.py` |
| `428cbab` | Khởi tạo `src/web` Claim Flow Studio |
| `20fb638` | HTTP API live + nối FE với backend |
| `a2b4874` / `a5280f2` / `ba29b42` | PR merge nhánh orchestrator vào `main` (metadata remote) |

### Test

- File: `src/tests/test_orchestrator_shape.py`
- Lệnh đã chạy (2026-11-17):

```bash
cd src
set PYTEST_DISABLE_PLUGIN_AUTOLOAD=1
python -m pytest -q tests/test_orchestrator_shape.py -o addopts=
```

- Kết quả: **`12 passed in 0.43s`**

### Demo chạy thật (API)

- `python -m lab8.web_api` rồi `POST /api/run` với `shape=workflow`, `claim_id=C-001`, `seed=11` trả `status=resolved`, refund 35000 từ `run_shape` (kiểm tra trong phiên làm việc demo).

## 5. Công cụ AI đã dùng

- **Cursor** (Composer/agent): hỗ trợ viết orchestrator/tests
- **Cách tự kiểm tra:** chạy `pytest` file orchestrator (12 passed); chạy live API/`run_shape` khi demo FE; đối chiếu handoff/trace không chứa `CANARY_SECRET_`; không bịa số liệu benchmark — phần benchmark do thành viên khác phụ trách.

## 6. Tự đánh giá

- Phần bắt buộc T008/T009 đã có code + test riêng trên Git và đã tự chạy lại được **12/12**.
- Hiểu và giữ ranh giới: investigator chỉ đọc, host ghi refund, secret/PII không vào handoff/trace.
- Phần demo FE/API giúp nhóm quan sát luồng, nhưng **không thay** must-pass của shape; điểm chấm vẫn dựa trên orchestrator/test/host suite.
- Hạn chế: output console pytest chưa được lưu thành file artifact trong repo; nếu cần nộp kèm log, nên lưu lại lần chạy tiếp theo.
