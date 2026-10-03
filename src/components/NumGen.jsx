import React, { Component } from 'react';
import {SIZE} from '../constants/actionTypes.js';

//Each numBoss color gets its own axolotl (red uses the pink one)
const bossImages = {
	red: 'assets/num-boss.png',
	blue: 'assets/num-boss-blue.png',
	orange: 'assets/num-boss-orange.png',
};

const NumGen = (props) => {
	const leftPos = String(props.Pos[1]*SIZE) + 'px';
	const topPos = String(props.Pos[0]*SIZE) + 'px';
	const image = bossImages[props.color] || bossImages.red;

	return <div className="numGen" style={{left: leftPos, top: topPos, backgroundImage: `url('${image}')`, backgroundSize: '80px'}}></div>;

};
	

export default NumGen;