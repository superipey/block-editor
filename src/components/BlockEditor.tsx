import {createElement, useRef} from '@wordpress/element'
import {
    BlockEditorKeyboardShortcuts,
    BlockEditorProvider,
    BlockInspector,
    BlockList,
    BlockTools,
    Inserter,
    ObserveTyping,
    WritingFlow,
} from '@wordpress/block-editor'
import {Popover, ToolbarButton} from '@wordpress/components'
import {redo as redoIcon, undo as undoIcon} from '@wordpress/icons'

import Header from './Header'
import Sidebar from './Sidebar'
import InserterToggle from './InserterToggle'
import EditorSettings from '../interfaces/editor-settings'
import Block from '../interfaces/block'
import Notices from "./Notices"

import '@wordpress/format-library'

interface BlockEditorProps {
    settings: EditorSettings,
    blocks: Block[],
    onChange: (blocks: Block[]) => void,
    undo?: () => void,
    redo?: () => void,
    canUndo?: boolean,
    canRedo?: boolean
}

const BlockEditor = ({settings, onChange, blocks, undo, redo, canUndo, canRedo}: BlockEditorProps) => {
    const inputTimeout = useRef<NodeJS.Timeout | null>(null)

    const handleInput = (blocks: Block[]) => {
        if (inputTimeout.current) {
            clearTimeout(inputTimeout.current)
        }

        inputTimeout.current = setTimeout(() => {
            onChange(blocks)
        }, 100)
    }

    const handleChange = (blocks: Block[]) => {
        if (inputTimeout.current) {
            clearTimeout(inputTimeout.current)
        }

        onChange(blocks)
    }

    return (
        <div className="block-editor__editor wp-embed-responsive">
            <BlockEditorProvider
                value={blocks}
                onInput={handleInput}
                onChange={handleChange}
                settings={settings}
            >
                <Notices/>
                <Header.Fill>
                    <Inserter renderToggle={InserterToggle}/>
                    <ToolbarButton icon={undoIcon} onClick={undo} disabled={!canUndo} className={'history-button'}/>
                    <ToolbarButton icon={redoIcon} onClick={redo} disabled={!canRedo} className={'history-button'}/>
                </Header.Fill>
                <Sidebar.Fill>
                    <BlockInspector/>
                </Sidebar.Fill>
                <BlockTools>
                    <BlockEditorKeyboardShortcuts.Register/>
                    <div className="editor-styles-wrapper">
                        <WritingFlow>
                            <ObserveTyping>
                                <BlockList/>
                            </ObserveTyping>
                        </WritingFlow>
                    </div>
                </BlockTools>
                <Popover.Slot/>
            </BlockEditorProvider>
        </div>
    );
};

export default BlockEditor;
