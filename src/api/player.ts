import { Position } from './position';

export interface Player {
	id: number;
	name: string;
	team: number;
	admin: boolean;
	position: Position;
	auth: string;
	conn: string;
}