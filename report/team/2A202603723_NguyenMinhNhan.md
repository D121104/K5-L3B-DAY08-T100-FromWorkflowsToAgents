# Báo cáo cá nhân — Nguyễn Minh Nhân

## 1. Thông tin thành viên

- **Họ tên:** Nguyễn Minh Nhân
- **MSSV:** 2A202603723
- **Email:** 26ai.nhannm@vinuni.edu.vn
- **GitHub:** https://github.com/uscalurn

## 2. Phần việc phụ trách

Phụ trách triển khai **Shape B — Single Agent (ReAct)** theo nhiệm vụ T006–T007 trong Lab 8 — From Workflows to Agents.

- Xây dựng luồng xử lý claim bằng kiến trúc Single Agent.
- Tích hợp ReAct runtime, MockLLM, Budget và Trace.
- Điều phối các read tools để điều tra claim, tra cứu order, policy và tính toán quyền lợi hoàn phí.
- Đảm bảo ranh giới an toàn giữa Agent và host khi thực hiện refund.

## 3. Đóng góp cụ thể

**Commit chính:** `303976a` — `Implement Shape B single-agent ReAct`.

**Tệp triển khai:** `src/lab8/shapes/single.py`.

Các nội dung đã thực hiện:

- Triển khai `run_claim()` theo contract của Lab 8.
- Sử dụng `run_react()` với giới hạn tối đa 8 bước.
- Xây dựng hàm `decide()` điều phối read tools dựa trên kết quả quan sát.
- Tích hợp `mock_llm.complete()` để mô phỏng model calls và theo dõi chi phí.
- Sử dụng `compute_compensation` để tính quote theo quy tắc nghiệp vụ.
- Gọi `durability.issue_refund()` sau vòng điều tra để host kiểm tra approval, refund cap và idempotency.
- Ghi Trace theo cấu trúc quy định, hạn chế đưa dữ liệu không đáng tin cậy hoặc thông tin nhạy cảm vào kết quả.

**Quyết định kỹ thuật:** Việc lựa chọn tool được điều phối bằng logic Python trên observation, còn MockLLM mô phỏng model calls. Quyền ghi refund không được trao cho Agent.

**Test đã thêm hoặc sửa:** Không có test riêng cho Shape B được xác nhận trong lịch sử Git hiện tại.

## 4. Bằng chứng

- **Commit:** `303976a Implement Shape B single-agent ReAct`
- **Source:** `src/lab8/shapes/single.py`

## 5. Công cụ AI đã dùng

**OpenAI Codex trong VS Code**

- Hỗ trợ đọc và phân tích cấu trúc starter code, API và các contract.
- Hỗ trợ triển khai Shape B trong `single.py`.
- Hỗ trợ rà soát xử lý lỗi, safety boundary và logic ReAct.

**ChatGPT**

- Hỗ trợ giải thích kiến trúc Single Agent, ReAct và ranh giới quyền giữa Model, Tool và Host.
- Hỗ trợ phân tích kết quả pytest, benchmark và yêu cầu rubric.

**Cách tự kiểm tra**

- Trực tiếp chạy student tests để xác nhận Shape B hoạt động đúng.
- Chạy benchmark trên 14 claim với 5 seed để đánh giá pass rate, variance và chi phí.
- Chạy crash suite và đối chiếu các yêu cầu an toàn của bài.
- Kiểm tra mã nguồn và lịch sử Git để xác nhận phạm vi đóng góp.

## 6. Tự đánh giá

Tôi đã hoàn thành phần triển khai Shape B — Single Agent (ReAct) theo nhiệm vụ T006–T007, đáp ứng contract và các kiểm thử công khai của Lab 8.

Shape B đạt 100% pass rate trên 14 public claims với 5 seed, không có biến động giữa các seed. Quá trình triển khai giúp tôi hiểu rõ hơn về kiến trúc Agent, vòng ReAct, quản lý chi phí và phân tách trách nhiệm giữa AI và host trong các nghiệp vụ có tác động tài chính.

Hạn chế của phiên bản hiện tại là việc lựa chọn tool chủ yếu được điều phối bằng logic Python, thay vì quyết định trực tiếp từ đầu ra MockLLM. Ngoài ra, tôi chưa bổ sung test riêng cho Shape B vào repository.
