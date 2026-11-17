import type { Claim, NodeRunState, RunOutcome, ShapeId, StepEvent } from '../types'
import { EventLog } from './EventLog'
import { NodeInspector } from './NodeInspector'
import { ResultPanel } from './ResultPanel'

interface Props {
  collapsed: boolean
  onToggle: () => void
  claim: Claim
  outcome: RunOutcome | null
  shape: ShapeId
  selectedNodeId: string | null
  nodeStates: Record<string, NodeRunState>
  events: StepEvent[]
}

export function RightRail({
  collapsed,
  onToggle,
  claim,
  outcome,
  shape,
  selectedNodeId,
  nodeStates,
  events,
}: Props) {
  return (
    <aside className={`rail rail-right ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="rail-toggle rail-toggle--right"
        onClick={onToggle}
        aria-label={collapsed ? 'Mở panel phải' : 'Thu panel phải'}
        title={collapsed ? 'Mở panel' : 'Thu panel'}
      >
        <span className="rail-toggle__bar" />
      </button>

      <div className="rail-body">
        <div className="right-stack">
          <ResultPanel claim={claim} outcome={outcome} />
          <NodeInspector
            shape={shape}
            nodeId={selectedNodeId}
            nodeStates={nodeStates}
            events={events}
          />
          <EventLog events={events} />
        </div>
      </div>
    </aside>
  )
}
