import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Spotify from '../../util/spotify'

import styles from './play.module.css'

import GuessCard from '../GuessCard/guessCard'


function Play() {

    const [cards, setCards] = useState<{ display: string; target: string; hint: string; gaveUp: boolean; targetVisible: boolean; }[]>([])
    const [guessText, setGuessText] = useState<string>("")
    const [guessList, setGuessList] = useState<string[]>([])
    const [correctAnswers, setCorrectAnswers] = useState<string[]>([] as string[])
    const [validGuess, setValidGuess] = useState<boolean>(true)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const type = searchParams.get('type')
        const range = searchParams.get('range')
        Spotify.getTop(type ?? '', range ?? '').then((items) => {
            setCards(items.map((item: any) => ({
                target: item.target.toLowerCase(),
                display: item.target,
                hint: item.hint,
                gaveUp: false,
                targetVisible: false
            })));
            setCorrectAnswers(items.map((item: any) => item.target.toLowerCase()));
        });
    }, [])

    const handleChange = (event: any) => {
        setGuessText(event.target.value)
    }

    const onSubmit = (event: any) => {
        event.preventDefault()
        if (guessText === "") {
            return
        }
        var lowerGuessText = guessText.toLowerCase()
        if (guessList.includes(lowerGuessText)) {
            setValidGuess(false)
            return
        }
        setValidGuess(true)

        setGuessList(prevList => {
            const newList = [...prevList, lowerGuessText]
            return newList 
        })

        updateCards(lowerGuessText)

        if(correctAnswers.includes(lowerGuessText)) {
            setGuessText("");
        }
    }

    const updateCards = (newGuess: any) => {
        setCards(prevCards => 
            prevCards.map((card, index) => ({
                ...card,
                targetVisible: card.targetVisible || cards[index].target === newGuess,
            }))
        );
    }


    const giveUp = () => {
        setCards(prevCards => 
            prevCards.map((card) => ({
                ...card,
                gaveUp: (!card.targetVisible),
                targetVisible: true,
            }))
        );
    }
    
    var cardLabel;
    var cardComp;
    if(searchParams.get('type') === 'tracks') {
        cardLabel = <GuessCard
                        num={0}
                        label={true}
                        target="Song"
                        hint="Artist"
                        display=""
                        targetVisible={false}
                        gaveUp={false}

                    />
        cardComp = cards.map((card, index) => (
            <GuessCard
                key={index}
                num={index}
                target={card.target}
                display={card.display}
                targetVisible={card.targetVisible}
                hint={card.hint}
                gaveUp={card.gaveUp}
                label={false}
            />
        ));
    } else {
        cardLabel = <GuessCard
                        num={0}
                        label={true}
                        target="Artist"
                        hint="Artist"
                        display=""
                        targetVisible={false}
                        gaveUp={false}
                    />
        cardComp = cards.map((card, index) => (
            <GuessCard
                key={index}
                num={index}
                target={card.target}
                display={card.display}
                targetVisible={card.targetVisible}
                hint=""
                gaveUp={card.gaveUp}
                label={false}
            />
        ));
    }

    return (
        <div className={styles.play}>
            <form className={styles.form} onSubmit={onSubmit}>
                <input type="text" placeholder="Guess" value={guessText} onChange={handleChange}/>
                <button type="submit" onClick={onSubmit}>Submit</button>
                <div className={styles.giveUp} onClick={giveUp}><p>Give Up?</p></div>
            </form>
            {!validGuess ? <p className={styles.error}>You already guessed that</p> : <p className={styles.placeHolder}>0</p>}
            {cardLabel}
            <div className={styles.cardList}>
                {cardComp}
            </div>
        </div>
    )
}

export default Play