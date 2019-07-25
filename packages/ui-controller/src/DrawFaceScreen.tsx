import React from 'react';
import { Button } from 'reactstrap';
import { SketchField, Tools } from 'react-sketch';
import debug from 'debug';
import constant from 'lodash/constant';
import noop from 'lodash/noop';
import { useDispatch } from 'react-redux';
import { setPlayer } from './player';

const log = debug('crazytown:DrawFaceScreen');

const DrawFaceScreen: ScreenFC = ({ history, location }) => {
	const sketchRef = React.useRef({
		canUndo: constant(false),
		undo: noop,
		toDataURL: constant(''),
	});
	const [canUndo, setCanUndo] = React.useState(false);
	const dispatch = useDispatch();

	log(location.state);
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
						const dataUrl = sketchRef.current.toDataURL();
						log('Submitted image %o', dataUrl);
						dispatch(setPlayer({ name: location.state.name, src: dataUrl }));
						history.goBack();
					}}
				>
					Done
				</Button>
			</div>
		</div>
	);
};

export default DrawFaceScreen;
