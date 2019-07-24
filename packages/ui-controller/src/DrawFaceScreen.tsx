import React from 'react';
import { Button } from 'reactstrap';
import { SketchField, Tools } from 'react-sketch';
import debug from 'debug';
import constant from 'lodash/constant';
import noop from 'lodash/noop';
import { RouteComponentProps } from 'react-router';

const log = debug('crazytown:DrawFaceScreen');

const DrawFaceScreen: React.FunctionComponent<RouteComponentProps> = () => {
	const sketchRef = React.useRef({
		canUndo: constant(false),
		undo: noop,
		toDataURL: constant(''),
	});
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
						log(sketchRef.current);
						//const svg = sketchRef.current._fc.toSVG();
						//const svg = sketchRef.current.toJSON();
						const img = sketchRef.current.toDataURL();
						log('Submitted image %o', img);
					}}
				>
					Done
				</Button>
			</div>
		</div>
	);
};

export default DrawFaceScreen;
