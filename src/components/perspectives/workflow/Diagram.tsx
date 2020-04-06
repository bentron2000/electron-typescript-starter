import * as React from 'react'
import pluralize from 'pluralize'
import { useStoreState, useStoreActions } from '@redux/store'
import { GraphView, IEdge, INode } from 'react-digraph-bentron'

import { LoupeRealmErrorResponse } from '@models/ipc'
import { Stage } from '@models/Stage'
import { StageTransition } from '@models/StageTransition'
import { findParent } from '@helpers/domHelpers'
import { useToasts } from '@components/shared/toast/ToastProvider'
import { DiagramControls } from './DiagramControls'
import DiagramNode from './DiagramNode'

export interface DiagramConfig {
  zoomLevel: number
  offsetX: number
  offsetY: number
}

const GraphConfig = {
  NodeTypes: {
    automatedStage: {
      shapeId: '#automatedStage',
      shape: (
        <symbol viewBox='0 0 50 50' id='automatedStage' key='0'>
          <circle cx='25' cy='25' r='25' fill='#373e49' stroke='#687582' />
        </symbol>
      ),
    },
  },
  NodeSubtypes: {},
  EdgeTypes: {
    emptyEdge: {
      // required to show empty edges
      shapeId: '#emptyEdge',
      shape: <symbol viewBox='0 0 50 50' id='emptyEdge' key='0' />,
    },
  },
}
const NODE_HEIGHT = 60
const NODE_WIDTH = 250

const valueInRange = (value: number, min: number, max: number) =>
  value >= min && value <= max

const rectOverlap = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  w: number,
  h: number
) => {
  const xOverlap =
    valueInRange(x1, x2 - w / 2, x2 + w / 2) ||
    valueInRange(x2, x1 - w / 2, x1 + w / 2)

  const yOverlap =
    valueInRange(y1, y2 - h / 2, y2 + h / 2) ||
    valueInRange(y2, y1 - h / 2, y1 + h / 2)

  return xOverlap && yOverlap
}

const isOverlappingOtherNode = (nodes: any[], node: any) => {
  // TODO: Maybe we want a buffer so stages cant be flush up against each other
  return nodes.find(
    n =>
      n.id !== node.id &&
      rectOverlap(node.x, node.y, n.x, n.y, NODE_WIDTH, NODE_HEIGHT)
  )
}

const StageToastContent = ({
  action,
  stagesCount,
}: {
  action: string
  stagesCount: number
}) => {
  return (
    <>
      Stage {action} and visible on{' '}
      <strong>
        {stagesCount} workflow {pluralize('sections', stagesCount)}
      </strong>
      .
    </>
  )
}

export default () => {
  const { addToast } = useToasts()
  const stages = useStoreState(state => state.project.stages.all)
  const transitions = useStoreState(
    state => state.workflowPerspective.transition.all
  )
  const setCurrentStage = useStoreActions(
    actions => actions.workflowPerspective.stage.set
  )
  const clearCurrentStage = useStoreActions(
    actions => actions.workflowPerspective.stage.clear
  )
  const setCurrentTransition = useStoreActions(
    actions => actions.workflowPerspective.transition.set
  )
  const clearCurrentTransition = useStoreActions(
    actions => actions.workflowPerspective.transition.clear
  )
  const createStage = useStoreActions(
    actions => actions.workflowPerspective.stage.create
  )
  const deleteStage = useStoreActions(
    actions => actions.workflowPerspective.stage.delete
  )
  const createTransition = useStoreActions(
    actions => actions.workflowPerspective.transition.create
  )
  const deleteTransition = useStoreActions(
    actions => actions.workflowPerspective.transition.delete
  )
  const updateTransition = useStoreActions(
    actions => actions.workflowPerspective.transition.update
  )
  const updateStage = useStoreActions(a => a.workflowPerspective.stage.update)
  const updatePerspectiveData = useStoreActions(
    a => a.app.updatePerspectiveData
  )

  const currentStage = useStoreState(s => s.workflowPerspective.stage.current)
  const currentTransition = useStoreState(
    s => s.workflowPerspective.transition.current
  )
  const toggleStageEditing = useStoreState(
    s => s.workflowPerspective.stage.toggleStageEditing
  )

  const nodes = stages.map(s => ({
    id: s.id,
    title: s.name,
    type: s.name === 'QA' ? 'automatedStage' : 'custom', // grr Jules :/
    loupeData: s,
    x: JSON.parse(s.diagramConfig || '{}').x,
    y: JSON.parse(s.diagramConfig || '{}').y,
  }))

  const edges = transitions.map(t => ({
    type: 'emptyEdge',
    handleText: t.name,
    loupeData: t,
    source: t.sourceStageId,
    target: t.destinationStageId,
  }))

  const selectedNode = nodes.find(
    n => n.id === (currentStage && currentStage.id)
  )

  const selectedEdge = edges.find(
    e =>
      e.source === (currentTransition && currentTransition.sourceStageId) &&
      e.target === (currentTransition && currentTransition.destinationStageId)
  )

  // If the click event target element or any of it's ancestors are set to `is-editable`
  // override the react-diagram drag event.
  const onOverrideableDrag = (ev: any) => {
    return !!findParent(ev.sourceEvent.target, '[data-is-editable=true]')
  }

  const handleSelectStage = (stage?: Stage) => {
    clearCurrentTransition()
    if (stage) {
      setCurrentStage(stage)
      updatePerspectiveData({ id: 'workflow', data: { rhpTitle: stage.name } })
    } else {
      clearCurrentStage()
      updatePerspectiveData({ id: 'workflow' })
    }
  }

  const handleUpdateStage = (stage: Stage) => {
    updatePerspectiveData({ id: 'workflow', data: { rhpTitle: stage.name } })
    updateStage(stage)
  }

  const handleDuplicateStage = (stage: Stage) => {
    createStage(stage)
      .then(({ data: st }: { data: Stage }) => {
        addToast(
          <StageToastContent
            action='duplicated'
            stagesCount={st.sectionIds.length}
          />
        )
      })
      .catch((err: LoupeRealmErrorResponse) => {
        addToast(err.message, { type: 'negative' })
      })
  }

  const handleDeleteStage = (stage: Stage) => {
    deleteStage(stage)
      .then(() => {
        addToast(`Removed ${stage.name} Stage`)
        handleSelectStage()
      })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  const handleSelectTransition = (trans: StageTransition) => {
    if (trans) {
      setCurrentTransition(trans)
      clearCurrentStage()
    } else {
      clearCurrentTransition()
    }
  }

  const renderNode = (
    _ref: any,
    data: any,
    id: string,
    selected: boolean,
    hover: boolean,
    props: any
  ) => {
    // highlighting the dest & source nodes for a selected transition
    const linkedToCurrentTransition = Boolean(
      currentTransition &&
        (currentTransition.destinationStageId === id ||
          currentTransition.sourceStageId === id)
    )

    return (
      <DiagramNode
        id={id}
        selected={selected || (currentStage && currentStage.id) === id}
        data={data}
        hover={hover}
        linked={linkedToCurrentTransition}
        props={props}
        onUpdateStage={handleUpdateStage}
        onDuplicateStage={handleDuplicateStage}
        onDeleteStage={handleDeleteStage}
        toggleEditView={id === toggleStageEditing}
      />
    )
  }

  const handleUpdateNode = (node: any) => {
    if (isOverlappingOtherNode(nodes, node)) {
      // TODO: why do we need to update a stage? Wouldn't simply sending toaster
      // and returning do the trick?
      return updateStage(node.loupeData)
        .then(() => addToast('Overlapping other stage', { type: 'negative' }))
        .catch((err: LoupeRealmErrorResponse) =>
          addToast(err.message, { type: 'negative' })
        )
    }

    return updateStage({
      ...node.loupeData,
      diagramConfig: JSON.stringify({ x: node.x, y: node.y }),
    }).catch((err: LoupeRealmErrorResponse) =>
      addToast(err.message, { type: 'negative' })
    )
  }

  const handleSelectNode = (node: any) => {
    handleSelectStage(node ? node.loupeData : undefined)
  }

  const handleSelectEdge = (edge: any) => {
    handleSelectTransition(edge ? edge.loupeData : undefined)
  }

  const handleSwapEdge = (_sourceNode: any, targetNode: any, edge: any) => {
    updateTransition({
      ...edge,
      destinationStageId: targetNode.id,
    })
  }

  const handleCreateNode = (_x: number, _y: number, _ev: any) => {
    return
  }

  const handleDeleteNode = (selected: any, _id: string, _nodes: any[]) => {
    handleDeleteStage(selected.loupeData)
  }

  const handleCreateEdge = (sourceNode: any, targetNode: any) => {
    createTransition({
      id: '',
      model: 'StageTransition',
      name: 'New Transition',
      sourceStageId: sourceNode.id,
      destinationStageId: targetNode.id,
    })
      .then(({ data }: { data: StageTransition }) => {
        addToast('New Transition created')
        handleSelectTransition(data)
      })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  const handleDeleteEdge = (selected: any, _edges: any[]) => {
    clearCurrentTransition()
    deleteTransition(selected.loupeData)
      .then(() => {
        addToast(`Removed ${selected.loupeData.name} Transition`)
      })
      .catch((err: LoupeRealmErrorResponse) =>
        addToast(err.message, { type: 'negative' })
      )
  }

  const handleBackgroundClick = () => {
    clearCurrentTransition()
  }

  // When selecting an edge react-digraph does not rerender nodes by default.
  // This is needed to rerun the `renderNode` callback above, and correctly determine
  // the "linked to " UI state.
  const handleShouldForceReRender = ({
    prevEdge,
    edge,
  }: {
    prevEdge: IEdge
    edge: IEdge
    prevNode: INode
    node: INode
  }) => {
    return prevEdge !== edge
  }

  React.useEffect(() => {
    if (currentStage) {
      updatePerspectiveData({
        id: 'workflow',
        data: { rhpTitle: currentStage.name },
      })
    }
  }, [currentStage])

  return (
    <div id='graph' style={{ height: '100%' }}>
      <GraphView
        nodeKey={'id'}
        nodes={nodes}
        edges={edges}
        gridSpacing={100}
        layoutEngineType={'SnapToGrid'}
        centerNodeOnMove={false}
        renderBackground={(gridSize: number) => (
          <rect
            x={-(gridSize || 0) / 4}
            y={-(gridSize || 0) / 4}
            width={gridSize}
            height={gridSize}
            fill={'#2B313D'}
          />
        )}
        nodeHeight={NODE_HEIGHT}
        nodeWidth={NODE_WIDTH}
        edgeHandleSize={15}
        nodeEdgeHandleSelector={'.create-edge-handle'}
        selected={selectedNode || selectedEdge}
        nodeTypes={GraphConfig.NodeTypes}
        nodeSubtypes={GraphConfig.NodeSubtypes}
        edgeTypes={GraphConfig.EdgeTypes}
        showGraphControls={true}
        CustomControls={DiagramControls}
        renderNode={renderNode}
        renderNodeText={() => ''}
        onOverrideableClick={onOverrideableDrag}
        onSelectNode={handleSelectNode}
        onSelectEdge={handleSelectEdge}
        onUpdateNode={handleUpdateNode}
        onSwapEdge={handleSwapEdge}
        onCreateNode={handleCreateNode}
        onDeleteNode={handleDeleteNode}
        onCreateEdge={handleCreateEdge}
        onDeleteEdge={handleDeleteEdge}
        onBackgroundClick={handleBackgroundClick}
        shouldForceReRender={handleShouldForceReRender}
      />
    </div>
  )
}
