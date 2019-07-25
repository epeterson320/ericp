/// <reference types="react-scripts" />

declare module 'react-sketch' {
	export enum Tools {
		Pencil,
		/* others too, but only Pencil is used */
	}
	export const SketchField: React.ElementType<any>;
}

declare type ScreenFC = React.FC<RouteComponentProps>;
