# Báo cáo cá nhân — 2A202603770_BuiNgocHung

## 1. Thông tin thành viên

- Họ tên: Bùi Ngọc Hùng
- MSSV: 2A202603770
- Email: 26ai.hungbn@vinuni.edu.vn
- GitHub: Ngochung1772k4
- Vai trò trong nhóm: Thành viên 2, phụ trách shape A `workflow` (theo `docs/team-assignments.md`)

## 2. Phần việc phụ trách

Shape A `workflow`, tức task T004 (test) và T005 (code) trong `specs/001-claim-shape-implementation/tasks.md`.

| File | Việc |
|---|---|
| `src/lab8/shapes/workflow.py` | Thay stub `not_implemented` bằng luồng xử lý claim theo các bước cố định |
| `src/tests/test_workflow_shape.py` | 99 test riêng của workflow |

Tôi không sửa file nào ngoài hai file trên. Các file host, thước đo, config, data và test matrix dùng chung giữ nguyên.

## 3. Đóng góp cụ thể

**Commit:** `a81d469` trên nhánh `member-02/claim-shapes`, được merge vào `main` qua Pull Request #1 (merge commit `abaa6a3`). Commit có 2 file, `workflow.py` (+120/−6) và `test_workflow_shape.py` (+518).

**Luồng của `workflow.py`** (không vòng lặp, không để model chọn nhánh):

1. Đọc claim qua `get_claim_view` (không dùng `SELECT *`). Không tìm thấy → `failed`.
2. Claim không có `order_id` → `needs_info`. Không đi tìm mã đơn trong ticket.
3. `lookup_order`. Đơn không tồn tại hoặc của principal khác → `escalated`.
4. Tính quote bằng `compute_compensation` từ order row và policy hiện hành.
5. Quote bằng 0 → `denied`, **không** gọi `issue_refund`.
6. Quote lớn hơn 0 → `durability.issue_refund(conn, claim_id, <quote đầy đủ>, crash_at=crash_at)`.
7. Host chấp nhận → `resolved`. Amount conflict → `failed`. Host từ chối → `denied`. Cả ba trường hợp giữ `proposal_amount` bằng quote đầy đủ.

**Quyết định kỹ thuật tôi đưa ra:**

- **Truyền quote đầy đủ, không tự trừ phần đã hoàn.** Host đã tự trừ (T13, T14). Nếu shape trừ trước thì bị trừ hai lần.
- **Không đọc ticket.** Mã đơn lấy từ claim, số ngày trễ từ order, clause từ policy. Vì vậy workflow không phụ thuộc seed, khác swarm ở seed 55.
- **Quote bằng 0 thì không gọi host.** Khi đó không có gì để host kiểm, và host cũng không ghi audit `policy_denied`.
- **Không bắt `InjectedCrash`.** Shape chỉ ghi trace rồi `raise` lại, để T12 thấy crash thật sự xảy ra. Resume dựa vào ledger và idempotency key `refund:{claim_id}`, không dựa vào checkpoint.
- **Trace chỉ ghi view đã allowlist** (id claim, các field order trong `ORDER_FIELDS`, quote, kết quả host). Cố ý không ghi claim row (có `parent_secret`), ticket, approval, và dòng `effect` của ledger.
- **Model chỉ có đúng một lần gọi `draft`** ở cuối để soạn câu trả lời. Kết quả của nó không được đọc lại, nên không đổi được status hay số tiền.
- **Gọi tool qua `runtime.dispatch`** để `Budget` tự đếm tool call, và đóng kết nối SQLite trong `finally` (tránh khóa file `.sqlite` trên Windows).

**Test đã thêm** (`src/tests/test_workflow_shape.py`, 99 test), gồm các nhóm:

- `RunResult` hợp lệ và trace mới ở mọi nhánh return, kể cả `needs_info`, `escalated`, claim không tồn tại.
- Ánh xạ kết quả: thiếu `order_id`, đơn của người khác, đơn không tồn tại, đơn hủy hoặc đang giao, phí ship 0, hỏng hàng chưa xác minh, và chọn số lớn hơn thay vì cộng ship với damage.
- Ticket là dữ liệu: ticket nói sai số ngày trễ (chạy trên cả 5 seed), nhắc clause cũ, nhắc policy tương lai.
- Quote đầy đủ tới host (dùng spy để ghi lại tham số gọi `issue_refund`) cho T01, T03, T08, T13, T14.
- Cổng approval: hết hạn, thiếu, của claim khác, bị thu hồi hoặc pending, số tiền không dương. Mỗi ca kiểm cả lý do audit `policy_denied`.
- Idempotency: gọi lại cùng claim (T11), amount conflict.
- Crash và resume ở cả 3 điểm `crash_at`, và `crash_at` được chuyển tiếp xuống host.
- Bảo mật trace: không lộ secret, PII hay nội dung ticket trên mọi claim public, kể cả file phụ cùng thư mục.
- Model không đổi được kết quả (thay `complete` bằng bản trả lời độc hại), kết nối DB đóng sau khi chạy, kết quả không đổi theo seed.

## 4. Bằng chứng

- Commit `a81d469`, Pull Request #1 (nhánh `member-02/claim-shapes`), merge commit `abaa6a3`.
- Chạy trong `src/` (đã chạy lại trên `main` sau khi nhóm merge cả ba shape):
  - `python -m pytest -q tests/test_workflow_shape.py` → 99 passed
  - `python -m pytest -q -m student -o addopts= -k workflow` → 62 passed (trước khi viết: 62 failed)
  - `python -m pytest -q` (cổng host) → 165 passed trên `main`
- Chạy thử bằng `python -m lab8.run --shape workflow ... --seed 11`:
  - `R-workflow-C-014-s11`: `resolved`, `proposal_amount` 150000, ledger 120000 (host chỉ trả phần chênh vì đơn đã hoàn 30.000).
  - `R-workflow-C-013-s11`: `denied`, `proposal_amount` 35000, không có refund, lý do `order_already_refunded`.
  - `R-workflow-C-005-s11`: `escalated`, quote 0, lý do `outside_principal_scope`, kết quả không có SĐT, địa chỉ hay tên hàng.
- Số liệu benchmark 4 shape dùng cho quyết định kiến trúc nằm trong `src/reports/benchmark.json` do Thành viên 6 sinh ra, tôi không trích số từ lần chạy lẻ của mình.

## 5. Công cụ AI đã dùng

**Công cụ:** Claude Code (model Claude Sonnet 5.5, Anthropic), chạy trong VS Code.

**Dùng vào việc gì:**

- Đọc toàn bộ repo để giải thích đề, luật nghiệp vụ và các contract.
- Viết bản đầu của `workflow.py` và `test_workflow_shape.py` theo các bước trong docstring của đề.
- Giải thích các lỗi môi trường (chạy sai thư mục, venv, PowerShell) và các bước git.

**Cách tôi tự kiểm tra kết quả:**

- Chạy lại ba nhóm test ở mục 4 và xem kết quả thật, không chỉ tin lời công cụ.
- Chạy tay `lab8.run` trên C-014, C-013, C-005 và đối chiếu từng số với bảng luật trong `docs/business_rules.md` (ví dụ C-014 phải ra 120.000, không phải 150.000).
- Kiểm tra test có thực sự bắt lỗi bằng cách cố ý phá code theo bốn cách (bỏ `crash_at`, nuốt `InjectedCrash`, tự trừ tiền đã hoàn, tin số ngày trong ticket). Cả bốn đều làm test đỏ. Sau mỗi lần phá, file được khôi phục và đối chiếu lại với bản gốc.
- Đối chiếu danh sách file trong commit với phạm vi được phép sửa (`git show --stat`).

**Khó khăn khi dùng công cụ:** lần đầu thử phá code, lệnh backup thất bại nên hai chỗ phá bị ghi vào file thật. Tôi phát hiện, khôi phục về đúng bản gốc và chạy lại toàn bộ test trước khi commit. Ngoài ra commit message bị mất phần thân do cách PowerShell xử lý nhiều tham số `-m`. Phần việc đó đã được ghi trong mô tả PR.

## 6. Tự đánh giá

**Làm được:**

- Workflow qua đủ 62 test student, 99 test riêng, và không phụ thuộc seed.
- Giữ đúng ranh giới code và model, và không sửa file được bảo vệ.

**Giới hạn đã biết:**

- Chưa có kết quả trên bộ hidden (40 claim × 5 seed). Mọi số liệu hiện có là trên bộ public.
- MockLLM không phải model thật. Latency là `unavailable`, và cost chỉ là số mô phỏng.
- Test dùng dữ liệu public và dữ liệu tự sửa trong SQLite tạm, chưa phải các bẫy hidden.
- `crash_test` chỉ kiểm host và swarm. Crash của workflow được kiểm qua T12 và các test của tôi.

**Điều tôi hiểu rõ và điều tôi còn chưa chắc:**

- *Hiểu rõ (phần tôi làm):* workflow là chuỗi bước cố định, không để model quyết gì. Tiền do `compute_compensation` tính, nên model không thể làm đổi số tiền. Ticket chỉ là dữ liệu của khách, nên shape không đọc nó để lấy mã đơn hay số ngày trễ. Shape đưa **quote đầy đủ** cho host vì host đã tự trừ phần đã hoàn của đơn, trừ trước thì bị trừ hai lần (ca T14: quote 150.000, ledger 120.000). Quote bằng 0 thì shape tự từ chối và không gọi host. Chỉ khi quote lớn hơn 0 mà host từ chối thì host mới ghi audit `policy_denied` (ca T13).
- *Còn chưa chắc:* lúc đầu tôi khá mông lung về tổng thể bài lab và mất thời gian mới thấy rõ shape khác host ở chỗ nào. Bên trong host, tức transaction của `durability.issue_refund` và cách ledger chống ghi trùng khi crash, tôi chỉ đọc và kiểm bằng test chứ không tự viết, nên hiểu ở mức hành vi hơn là cách cài đặt. Tôi cũng chưa biết workflow sẽ đạt bao nhiêu trên bộ hidden, và chưa nắm sâu hai shape single và orchestrator vì đó là phần của bạn cùng nhóm.

**Bài học rút ra từ lab:**

- Với bài toán này, quy trình cố định đã đủ đúng và ổn định: workflow không phụ thuộc seed. Vì vậy "dùng agent" không mặc định tốt hơn. Quyết định chọn kiến trúc phải dựa trên số đo của cả bốn shape trên cùng claim và cùng seed.
- Ranh giới an toàn đặt ở đúng chỗ: việc nhạy cảm (tính tiền, duyệt, ghi ledger) giao cho code và host, model chỉ soạn chữ.
- Trace là ranh giới bảo mật chứ không phải log để debug. Phải chọn có chủ đích ghi gì và không ghi gì, ví dụ không ghi claim row, ticket hay approval.
- Test chỉ đáng tin khi chứng minh được nó bắt được lỗi. Khi cố ý phá code (bỏ `crash_at`, nuốt `InjectedCrash`, tự trừ tiền, tin ticket) thì test báo đỏ.
- Nếu làm lại, tôi sẽ đọc kỹ phần host trước khi viết shape, và thêm test cho các tình huống bẫy như ticket có nhiều con số mâu thuẫn.
