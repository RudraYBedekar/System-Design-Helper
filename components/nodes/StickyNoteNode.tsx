import React, { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';

const StickyNoteNode = ({ data, selected }: NodeProps) => {
    return (
        <>
            <NodeResizer minWidth={100} minHeight={100} isVisible={selected} lineClassName="border-yellow-600" handleClassName="h-3 w-3 bg-yellow-600 border-2 rounded border-yellow-800" />
            <div className="shadow-xl rounded-md bg-yellow-200 border-2 border-yellow-400 w-full h-full min-h-[100px] min-w-[100px] p-2 flex flex-col">
                <textarea
                    className="w-full h-full bg-transparent resize-none border-none outline-none text-yellow-900 placeholder-yellow-600/50 font-handwriting text-sm"
                    placeholder="Write a note..."
                    defaultValue={data.label}
                    onKeyDown={(e) => e.stopPropagation()}
                    onChange={(evt) => {
                        data.label = evt.target.value;
                    }}
                />
            </div>
        </>
    );
};

export default memo(StickyNoteNode);
