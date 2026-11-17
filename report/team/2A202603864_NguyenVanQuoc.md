# Báo cáo cá nhân — 2A202603864_NguyenVanQuoc

## 1. Thông tin thành viên

- Họ tên: Nguyễn Văn Quốc
- MSSV: 2A202603864
- Email:
- GitHub: missher03

## 2. Phần việc phụ trách

**Thành viên 5 — Kiểm tra ban đầu, cổng tích hợp, an toàn crash và xác minh cuối (T002, T010, T011, T016)**

- Chạy kiểm tra baseline (`lab8.smoke`, `pytest -q`) trước khi nhóm triển khai song song (T002).
- Chạy cổng tích hợp sau khi merge 3 PR shape (`workflow`, `single`, `orchestrator`) và rà soát tính toàn vẹn/bảo mật các file được bảo vệ (T010).
- Chạy bộ kiểm thử crash 20 điểm và tạo file bằng chứng `src/reports/crash.json` (T011).
- Chạy xác minh cuối theo `specs/001-claim-shape-implementation/quickstart.md` sau khi hoàn tất báo cáo/kiểm tra nộp bài (T016).

## 3. Đóng góp cụ thể

- **Báo cáo crash safety (T011):** Chạy `python -m lab8.crash_test --count 20 --out reports/crash.json` sinh `src/reports/crash.json` (commit `42c8cf2` trên nhánh `quoc/task5`).
- **Bộ test tích hợp bổ sung:** Tạo `src/tests/test_integration_safety.py` gồm 9 test case (parametrize trên `workflow`, `single`, `orchestrator`) kiểm tra:
  - `crash_at="after_effect_before_checkpoint"` ném `InjectedCrash` và khi resume chỉ tạo đúng 1 refund + 1 audit `refund_committed` cùng trace hợp lệ (`C-012`).
  - Shape bỏ qua dữ liệu giả mạo trong ticket ở `seed=55` (`C-002`) và không làm lộ `CANARY_SECRET_*`, SĐT, địa chỉ, tên hàng hay ghi chú nội bộ trong trace/`RunResult` (`C-005`).
  - Shape truyền full quote (`150000`) cho host để trừ phần đã hoàn trước đó còn `120000` (`C-014`).
- **Rà soát toàn vẹn (T010):** Kiểm tra `git diff --name-only deac9b2..HEAD`, xác nhận chỉ có các file shape và test tương ứng được thay đổi; không có file host, policy, metrics, config hay data nào bị chỉnh sửa.

## 4. Bằng chứng

- Commit báo cáo crash: `42c8cf2` (`chore(crash): add T011 crash safety report (20/20)`) trên nhánh `quoc/task5` — file `src/reports/crash.json` (`"crash_safety": "20/20"`, `20/20` scenarios passed).
- Kết quả chạy từ thư mục `src/`:
  - `python -m lab8.smoke` → `lab8.smoke pass` (`manifest 1.1 | MockLLM seeded | swarm C-001 refund 35000 | trace clean`)
  - `python -m pytest -q` → `165 passed, 248 deselected`
  - `python -m pytest -q -m student -o addopts=` → `248 passed, 165 deselected`
  - `python -m pytest -q tests/test_integration_safety.py` → `9 passed`
  - `python -m lab8.crash_test --count 20 --out reports/crash.json` → `crash_safety 20/20`

## 5. Công cụ AI đã dùng

- **Công cụ:** Trợ lý AI (Antigravity / Gemini).
- **Mục đích sử dụng:** Đọc hiểu tài liệu lab/contract, tổng hợp danh sách công việc theo `tasks.md`
- **Cách tự kiểm tra kết quả:** Chạy trực tiếp toàn bộ lệnh kiểm tra (`lab8.smoke`, `pytest -q`, `pytest -q -m student -o addopts=`, `lab8.crash_test`, `lab8.check_submission`) trong `.venv`, đối chiếu nội dung `src/reports/crash.json` và kiểm tra `git diff` để bảo đảm không chỉnh sửa file thuộc danh mục cấm.

## 6. Tự đánh giá

- Hoàn thành các nhiệm vụ T002, T010, T011 đúng phạm vi và quy định toàn vẹn của bài lab.
- Đã chuẩn bị sẵn test tích hợp cá nhân (`src/tests/test_integration_safety.py`) và file báo cáo cá nhân để tổng hợp vào bảng đóng góp (`TEAM.md`) và thực hiện bước xác minh cuối T016 khi nhóm hoàn tất T012–T014.
