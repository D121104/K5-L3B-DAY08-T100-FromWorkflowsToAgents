# Báo cáo nhóm — Lab 8 LogiX-VN

## 1. Thông tin nhóm

- Tên nhóm: T100
- Thành viên: xem `TEAM.md`;
- Commit mã nguồn được benchmark: `f176005`; commit báo cáo T013: `c800c85`; commit audit B7: `aab41c1`. Commit  chốt report: "finish lab day 08"

## 2. Mục tiêu và cách tiếp cận

Nhóm triển khai ba shape A/B/C để xử lý cùng contract và so sánh với shape swarm reference D.
Theo bảng phân công, Hùng phụ trách workflow, Nhân phụ trách single-agent, Hưng phụ trách
orchestrator; vai trò tích hợp, kiểm thử và benchmark/report được giao cho các thành viên còn
lại. Nền tảng/contract được chốt trước khi ba shape làm song song; benchmark chạy sau khi tích
hợp. Nhóm chọn thêm bonus B7, kiểm toán ba candidate grader bằng các quan hệ metamorphic; chi
tiết thành viên và commit được liệt kê trong `TEAM.md`.

## 3. Giải pháp

Workflow đọc claim/order/policy qua tool, code tính quote rồi gọi host. Single-agent dùng vòng
ReAct có giới hạn 8 bước và tool chỉ đọc; model không quyết định số tiền hay ghi refund. Shape
orchestrator tạo handoff theo allowlist, investigator chỉ đọc, còn orchestrator gọi host. Cả ba
truyền full quote để host áp approval/cap và giữ quyền ghi ledger. Workflow trace chỉ ghi ID,
view order đã allowlist, quote, verdict và quyết định; không ghi ticket, approval hay effect row.
Trace của các shape phải tuân thủ [docs/contracts.md](../../docs/contracts.md).

## 4. Kết quả

Benchmark do `lab8.benchmark` sinh, 14 claim × 5 seed = 70 trial mỗi shape:

| Shape | Pass | Pass^5 | Seed min–max | Variance | Cost/success mô phỏng (VND) | Mean/p95 steps |
|---|---:|---:|---:|---:|---:|---:|
| workflow | 1.000 (70/70) | 1.000 | 1.000–1.000 | 0.000000 | 28.87 | 4.43 / 5 |
| single | 1.000 (70/70) | 1.000 | 1.000–1.000 | 0.000000 | 54.65 | 10.64 / 12 |
| orchestrator | 1.000 (70/70) | 1.000 | 1.000–1.000 | 0.000000 | 46.43 | 2.79 / 3 |
| swarm | 0.986 (69/70) | 0.929 | 0.929–1.000 | 0.000816 | 49.57 | 2.80 / 3 |

Crash report hiện có `20/20`. Swarm có một trial lỗi `status resolved != denied` ở seed 55. Giá là mô phỏng, không phải API bill; latency unavailable. Người dùng xác nhận đã chạy lại benchmark bằng `.venv`; output/version chính xác chưa được lưu trong phiên này.

### Bonus B7 và kiểm tra hidden cục bộ

Các test B7 so sánh ba candidate grader. Không candidate nào đạt mọi quan hệ: grader_a đếm cost
sai, grader_b và grader_c sai `pass_5` khi lặp trials, còn grader_c đưa trial lỗi hạ tầng vào
mẫu số pass rate. Quan hệ mới thêm một trial thất bại để kiểm tra cost chỉ được tính một lần.
B7 tests pass 5/5.

| Gate/check | Kết quả tổng hợp |
|---|---:|
| Student matrix trên các shape | 248 passed |
| Pytest mặc định, gồm test B7 | 179 passed, 248 deselected |
| Crash safety | 20/20 |
| Hidden self-check workflow | 200 trial (40 claim × 5 seed); trace hợp lệ 200/200 |
| CANARY marker trong artifacts đã scan | 0 |
| Trial `resolved` trong 45 lượt của claim có approval không hợp lệ | 0 |
| Submission checker | 0 FAIL, 1 WARN do thay đổi chưa commit |

Hidden claims/world chỉ cung cấp input, không có expected labels. Vì vậy benchmark chạy self-check
chứ không chấm hidden pass rate; kết quả này không thay thế grader chính thức.

Quyết định kiến trúc và lý do: xem `report/team/decision_adr.md`. Phiếu nghiên cứu và ablation: xem `report/team/research_card.md`.

## 5. Khó khăn và cách xử lý

Thách thức chính là giữ ba shape tuân thủ cùng contract nhưng không để model tự quyết định số tiền
hoặc ghi refund. Nhóm giữ quyền kiểm tra approval, giới hạn theo đơn và ghi ledger tại host; các
shape chỉ tính quote rồi gửi yêu cầu qua host. Regression tests bao phủ approval thiếu/hết hạn/sai
claim, retry và crash/resume.

Với orchestrator, việc chia sẻ đủ dữ kiện cho investigator mà không chuyển secret/PII đòi hỏi
handoff theo allowlist và tool chỉ đọc; trace được kiểm tra riêng để phát hiện marker nhạy cảm.
Trong benchmark, nhóm cố định public claims/seeds và dùng SQLite riêng cho từng trial để kết quả
giữa các shape có thể so sánh và tái lập.

Giới hạn còn lại: hidden pack hiện chỉ có claims/world, không có expected labels hoặc grader riêng.
Nhóm đã chạy self-check aggregate về trace/leak và approval, nhưng chưa thể tính hidden pass rate
chính thức; không suy diễn kết quả này thành việc đã qua hidden gate.

## 6. Tổng hợp đóng góp

Chi tiết đóng góp, commits, tests và report evidence được liệt kê trong `TEAM.md` và các báo cáo
cá nhân. Git history và báo cáo cá nhân xác nhận test shape trong commit workflow `a81d469`,
orchestrator `d4e1899`, test tích hợp của Quốc `88b6ba3` và B7 của Duy `aab41c1`. Báo cáo của
Nhân ghi chưa có test riêng cho Shape B được xác nhận trong lịch sử Git; không gán test của người
khác cho Nhân.

## 7. Hạn chế và hướng cải thiện

MockLLM không phải model sản xuất; latency `unavailable`; bộ public chỉ có 14 claim; chi phí VND
là mô phỏng. Hidden self-check hiện chỉ xác nhận contract trace/CANARY và approval aggregate;
không có expected labels/grader để tính hidden pass rate hay xác nhận chính thức ngưỡng ≥ 0.80
và toàn bộ must-pass. T015 vì vậy chưa đủ điều kiện đóng; quyết định workflow cần được xem xét
lại nếu grader chính thức hoặc benchmark tái lập cho kết quả khác.

## 8. Tài liệu tham khảo

1. ACL Anthology, “Rethinking the Evaluation of Efficiency Methods for Multi-Agent Systems,”
   EMNLP 2026: https://aclanthology.org/2026.emnlp-main.798/.
2. `README.md`, `RUBRIC.md`, `docs/contracts.md`, `docs/business_rules.md`,
   `src/reports/README.md`.
