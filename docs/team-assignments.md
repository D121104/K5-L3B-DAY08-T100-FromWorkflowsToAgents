# Phân công nhóm: Triển khai các shape xử lý yêu cầu hoàn tiền

Đây là phương án chia việc cho sáu người đối với `specs/001-claim-shape-implementation/`.
Thay `Thành viên 1`–`Thành viên 6` bằng tên thật trước khi triển khai. Mỗi người làm trên
nhánh riêng và gửi thay đổi qua Pull Request để được đánh giá. Không sửa mô-đun do người khác
phụ trách nếu chưa thống nhất.

## Bảng phân công

| Thành viên | Trách nhiệm đề xuất | Task | File chính | Khối lượng/rủi ro dự kiến |
|---|---|---|---|---|
| Thành viên 1 | Trưởng tích hợp; chốt hợp đồng/quyền sở hữu file dùng chung; kiểm tra nộp bài cuối | T001, T003, T014 | `docs/team-assignments.md`, tài liệu hợp đồng (đánh giá/cố định, không sửa code), `src/lab8/check_submission.py` (chỉ chạy/đọc) | Trung bình; rủi ro điều phối. Không sở hữu shape. |
| Thành viên 2 | Shape A workflow | T004–T005 | `src/lab8/shapes/workflow.py`, `src/tests/test_workflow_shape.py` | Trung bình; luồng xác định, ranh giới kết quả/trace/refund. |
| Thành viên 3 | Shape B single-agent | T006–T007 | `src/lab8/shapes/single.py`, `src/tests/test_single_shape.py` | Trung bình-cao; hành vi ReAct/tool và giới hạn 8 bước. |
| Thành viên 4 | Shape C orchestrator/investigator | T008–T009 | `src/lab8/shapes/orchestrator.py`, `src/tests/test_orchestrator_shape.py` | Cao; handoff/quyền riêng tư và quyền của investigator. |
| Thành viên 5 | Kiểm tra ban đầu, kiểm thử tổng hợp, an toàn crash, xác minh cuối | T002, T010–T011, T016 | Chỉ chạy lệnh trong `src/`; report sinh ra `src/reports/crash.json`; gửi bằng chứng cho Thành viên 1 cập nhật tài liệu này | Trung bình-cao; chịu trách nhiệm các cổng tích hợp. Không sửa test/host được bảo vệ. |
| Thành viên 6 | Benchmark và báo cáo bằng chứng; chỉ làm chủ đề thưởng nếu nhóm chọn | T012–T013, T015 | `src/reports/benchmark.json` do công cụ sinh; `report/team/decision_adr.md`, `research_card.md`, `group_report.md`, báo cáo cá nhân; đường dẫn thưởng nếu chọn | Cao gần hạn nộp; ADR phụ thuộc kết quả có thể tái lập. |

## Quy ước nhánh và PR

Mỗi thành viên dùng một nhánh riêng, ví dụ `member-01/claim-shapes` đến
`member-06/claim-shapes`. Đây chỉ là tên gợi ý; nhóm có thể theo quy ước nhánh hiện tại miễn
là mỗi người có nhánh riêng. Mỗi PR PHẢI ghi Task ID và Requirement ID liên quan, kèm bằng
chứng kiểm thử hoặc hướng dẫn xác minh có thể tái lập, và không chứa thay đổi ngoài phạm vi.

## Phụ thuộc và các mốc tích hợp

| Mốc | Task bắt buộc | Tiêu chí hoàn tất | Điều phối |
|---|---|---|---|
| Sẵn sàng nền tảng | T001–T003 | Ghi nhận đủ sáu người/nhánh; `lab8.smoke` và host pytest pass; xác nhận hợp đồng dùng chung và ranh giới file. | Thành viên 1 điều phối; Thành viên 5 cung cấp kết quả ban đầu. |
| Lát cắt MVP | T004–T005 | Test workflow và nhóm student test của workflow pass. Đây chưa phải hoàn thành toàn bộ bài. | Thành viên 2 gửi PR; Thành viên 1 đánh giá ranh giới tích hợp. |
| Hoàn thành ba shape | T006–T009 | Test single-agent và orchestrator pass; cả ba PR shape đã được đánh giá/merge. | Thành viên 2–4 làm song song sau khi nền tảng hoàn tất. |
| Cổng tích hợp | T010 | Student matrix và host suite đầy đủ pass; không còn vi phạm chưa xử lý trong rà soát toàn vẹn/bảo mật. | Thành viên 5 chạy; Thành viên 1 điều phối sửa lỗi qua PR của người phụ trách. |
| Sẵn sàng bằng chứng | T011–T013 | Crash report `20/20`; benchmark gồm bốn shape, số claim/seed bắt buộc; báo cáo trích số liệu/run ID/commit từ output. | Thành viên 5 và 6 tạo hai report riêng song song; Thành viên 6 đợi đủ hai report rồi mới viết ADR. |
| Sẵn sàng nộp bài | T014–T016 | Checker `0 FAIL`; rà soát điều kiện nộp; ghi nhận kết quả xác minh theo tài liệu. | Thành viên 1 kiểm tra cuối; Thành viên 5 ghi kết quả; chỉ làm chủ đề thưởng sau khi phần bắt buộc xong. |

## Kiểm soát file dùng chung và xung đột

- **Mô-đun shape**: Thành viên 2, 3, 4 sở hữu độc quyền các mô-đun tương ứng. Không chỉnh sửa đồng thời cùng một mô-đun.
- **Kiểm thử**: mỗi người phụ trách shape chỉ thêm test trong file mới do mình phụ trách. `src/tests/test_public_matrix.py` và host tests là cổng nghiệm thu dùng chung, chỉ đọc.
- **API/host dùng chung**: `src/lab8/schemas.py`, `src/lab8/shapes/common.py`, `tools.py`, `runtime.py`, `handoff.py`, `durability.py`, `policy.py`, `metrics.py`, `db.py`, config và data không phải mục tiêu chỉnh sửa song song; một số file bị quy định bài tập cấm sửa.
- **Báo cáo**: lệnh benchmark và crash ghi ra hai file riêng, vì vậy Thành viên 5 và 6 có thể chạy song song sau T010. Mỗi file chỉ có người được giao tạo; không ai sửa JSON report bằng tay.
- **Tài liệu nhóm**: file này và `TEAM.md` là tài nguyên dùng chung. Thành viên gửi kết quả/dòng đóng góp cho Thành viên 1 tổng hợp thay vì cùng sửa đồng thời.
- **Tệp phát sinh khi chạy**: dùng đường dẫn SQLite riêng cho từng test/run; không dùng chung DB đang chạy và không commit SQLite/trace.
- **Sửa lỗi tích hợp**: chuyển thay đổi cho người phụ trách mô-đun và merge qua PR. Khi cần đổi hợp đồng dùng chung, tạm dừng phần việc phụ thuộc cho đến khi các thành viên liên quan thống nhất và hợp đồng cập nhật được đánh giá.

## Truy vết yêu cầu theo người phụ trách

| Mã yêu cầu | Người phụ trách chính | Người xác minh/tích hợp |
|---|---|---|
| M-01–M-07 | Thành viên 2 và 3 | Thành viên 5 tích hợp; Thành viên 1 điều phối contract |
| M-01–M-08 | Thành viên 4 | Thành viên 5 tích hợp; Thành viên 1 điều phối contract |
| M-09 | Thành viên 5 | Thành viên 1 kiểm tra cuối |
| M-10 | Thành viên 5 và 6 | Thành viên 6 tổng hợp báo cáo |
| M-11 | Thành viên 6 | Thành viên 1 đánh giá việc truy vết nguồn |
| M-12 | Thành viên 1 và 6 | Thành viên 1 kiểm tra cuối |
| M-13 | Tất cả thành viên trong phần việc của mình | Thành viên 5 rà soát; Thành viên 1 ghi nhận kết quả |
| O-01 | Thành viên 6, chỉ khi nhóm chọn | Thành viên 5 xác minh các cổng bắt buộc |

## Nhật ký bằng chứng

Thành viên 1 ghi ngày, lệnh, mã thoát và tóm tắt kết quả cho các cổng ban đầu/tích hợp/cuối
tại đây. Không ghi secret, nhãn hidden hoặc dữ liệu kiểm thử được bảo vệ.

| Ngày | Task ID | Lệnh/kiểm tra | Vị trí kết quả/bằng chứng | Người phụ trách |
|---|---|---|---|---|
| Chưa ghi | T002 | `python -m lab8.smoke`; `python -m pytest -q` từ `src/` | Chưa ghi | Thành viên 5 |
| Chưa ghi | T010 | Toàn bộ host suite và student matrix | Chưa ghi | Thành viên 5 |
| Chưa ghi | T011 | `python -m lab8.crash_test --count 20 --out reports/crash.json` | `src/reports/crash.json` | Thành viên 5 |
| Chưa ghi | T012 | Benchmark bốn shape theo yêu cầu | `src/reports/benchmark.json` | Thành viên 6 |
| Chưa ghi | T014 | `python -m lab8.check_submission` | Chưa ghi | Thành viên 1 |
