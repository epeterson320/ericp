import React from 'react';
import { Button } from 'reactstrap';
import { SketchField, Tools } from 'react-sketch';
import debug from 'debug';

const log = debug('crazytown:DrawFaceScreen');

export default function DrawFaceScreen() {
	const sketchRef = React.useRef();
	const [canUndo, setCanUndo] = React.useState(false);
	return (
		<div className="d-flex flex-column align-items-center">
			<h1 className="mb-3">Draw your big face</h1>
			<SketchField
				className="border mb-3"
				width={192}
				height={192}
				ref={sketchRef}
				tool={Tools.Pencil}
				onChange={() => {
					setCanUndo(sketchRef.current.canUndo());
				}}
			/>
			<div>
				<Button
					className="mr-3"
					disabled={!canUndo}
					onClick={() => sketchRef.current.undo()}
				>
					Undo
				</Button>
				<Button
					onClick={() => {
						const dataURL = sketchRef.current.toDataURL();
						log('Submitted image %o', dataURL);
					}}
				>
					Done
				</Button>
			</div>
		</div>
	);
}
