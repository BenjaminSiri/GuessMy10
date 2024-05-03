import React, { useState, useEffect } from "react";

import styles from "./guessCard.module.css";

interface GuessCardProps {
    target: string;
    hint: string;
    display: string;
    num: number;
    label: boolean; 
    targetVisible: boolean;
    gaveUp: boolean;

}

function GuessCard(props: GuessCardProps) {
    const [hint, setHint] = useState("Hint");

    useEffect(() => {
        if (props.targetVisible) {
            setHint(props.hint);
        }
    }, [props.targetVisible])

    if(props.label) {
        return (
            <div className={styles.labelCard}>
                <div className={styles.content}>
                    <div className={styles.contentItem}><h3>{props.target}</h3></div>
                    <div className={styles.contentItem}><h4>{props.hint}</h4></div>
                </div>
                <div className={styles.box}>
                    <h3>#</h3>
                </div>
            </div>
        );
    }

    const target = props.targetVisible ? props.display : "?";

    var color;
    if (props.targetVisible) {
        color = styles.green;
    }
    if (props.gaveUp) {
        color = styles.red;
    }

    const hintClick = () => {
        setHint(props.hint);
    }

    return (
        <div className={`${styles.guessCard} ${color}`}>
            <div className={styles.content}>
                <div className={styles.contentItem}><h4>{target}</h4></div>
                {props.hint && <div className={styles.contentItem} onClick={hintClick}><h4>{hint}</h4></div>}
            </div>
            <div className={styles.box}>
                <h3>{props.num+1}</h3>
            </div>
        </div>
    );
}

export default GuessCard;