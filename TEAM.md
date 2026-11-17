# Team

## Thông tin nhóm

- Tên nhóm: T100
- Lớp: L3B
- Repo nhóm: `K5-L3B-DAY08-T100-FromWorkflowsToAgents` (xem [SUBMISSION.md](SUBMISSION.md))
- URL repo: https://github.com/D121104/K5-L3B-DAY08-T100-FromWorkflowsToAgents
- Nhánh nộp: `main`; commit chốt report: "finish lab day 08"

## Thành viên

| STT | Họ tên | MSSV | Email | GitHub | Vai trò |
| --: | ------ | ---- | ----- | ------ | ------- |
| 1 | Đào Đức Duy | 2A202603900 | 26ai.duydd4@vinuni.edu.vn| D121104 | Trưởng nhóm, tích hợp/contract; benchmark và báo cáo |
| 2 | Bùi Ngọc Hùng | 2A202603770 | 26ai.hungbn@vinuni.edu.vn | Ngochung1772k4 | Workflow |
| 3 | Nguyễn Minh Nhân | 2A202603723 | 26ai.nhannm@vinuni.edu.vn | uscalurn | Single-agent |
| 4 | Trần Cảnh Hưng | 2A202603759 | 26ai.hungtc@vinuni.edu.vn | danialtranz | Orchestrator |
| 5 | Nguyễn Văn Quốc | 2A202603864 | 26ai.quocnc@viununi.edu.vn | missher03 | Kiểm thử tích hợp, crash và xác minh |

Gợi ý chia vai:

- Nhóm 6 người: integration; workflow; single agent; orchestrator; ledger/policy/crash; eval/report.
- Nhóm 4 người: workflow + integration; single; orchestrator + handoff; ledger + evaluation.

## Bảng đóng góp

`python -m lab8.check_submission` đọc bảng này bằng máy: giữ nguyên tiêu đề `## Bảng đóng góp` và các cột. Mỗi người một dòng: commit có nội dung và ít nhất một test đã thêm hoặc sửa.

| Người | Vai | Commit | Test đã thêm hoặc sửa |
| --- | --- | --- | --- |
| Đào Đức Duy (vai trò 1 và 6) | T001/T003 điều phối; T012/T013 benchmark/report; T015 B7 audit | `deac9b2` (T003), `c800c85` (T013), `aab41c1` (B7) | `src/tests/test_bonus_grader_audit.py` (được thêm trong `aab41c1`); T003/T013 chủ yếu là điều phối/report |
| Bùi Ngọc Hùng | Workflow T004/T005 | `a81d469` | `src/tests/test_workflow_shape.py` (được thêm trong commit) |
| Nguyễn Minh Nhân | Single-agent T006/T007 | `303976a` | Không tìm thấy test file/commit do tác giả này thêm/sửa trong lịch sử hiện có |
| Trần Cảnh Hưng | Orchestrator T008/T009 | `d4e1899` | `src/tests/test_orchestrator_shape.py` (được thêm trong commit) |
| Nguyễn Vắn Quốc | Crash evidence T011; tích hợp/xác minh theo phân công | `42c8cf2` | Không có test được thêm/sửa trong commit crash report; `src/reports/crash.json` là artifact kiểm thử do công cụ sinh |

## Cá nhân

Mỗi thành viên đồng thời tạo một báo cáo riêng trong `report/` theo dạng:

```text
report/team/MSSV_HoTen.md
```

Ví dụ: `report/team/20241234_NguyenVanAn.md`.

Sao chép mục dưới đây cho từng thành viên.

## MSSV_HoTen

### Phần việc phụ trách

-

### Đóng góp cụ thể

-

### Bằng chứng

-
