/* eslint-disable */
import React, { useState } from "react";
import { useSelector } from "react-redux";
import SmileImage from "../../../assets/img/emoji/Smileys1.png";
import ActivitiesImage from "../../../assets/img/emoji/Activities1.png";
import AnimalNatureImage from "../../../assets/img/emoji/Animals1.png";
import FlagImage from "../../../assets/img/emoji/flag1.png";
import FoodDriknsImage from "../../../assets/img/emoji/food1.png";
import ObjectsImage from "../../../assets/img/emoji/Objects1.png";
import TravelImage from "../../../assets/img/emoji/Travel1.png";
import NoEomji from "../../../assets/img/emoji/NoEmojiFound.png";

const EmojiPicker = (props) => {
    const { isMessageEmpty, setIsMessageEmpty, setpicker, id, setIstextEmoji } = props;
    const Emojilist = useSelector((state) => state.allReducers.emojilist);
    const [ SelectEmojiTab, setSelectEmojiTab ] = useState("Smileys_Emotion");
    const [ searchEmojiValue, setSearchEmojiValue ] = useState("");

    const selectEmoji = (emoji) => {
        document.getElementById(id).innerHTML +=  emoji.emoji;
        if(id === "messagFieldID") {
            setIsMessageEmpty({...isMessageEmpty, emojiIstrue: true, messageIstrue: true});
        } else {
            setIstextEmoji(true);
            setpicker(false);
        }
        // cursor focus contenteditable div
        const el = document.getElementById(id);
        const selection = window.getSelection();
        const range = document.createRange();
        selection.removeAllRanges();
        range.selectNodeContents(el);
        range.collapse(false);
        selection.addRange(range);
        el.focus();
    }

    const SearchEmojiArray = Emojilist && Emojilist[SelectEmojiTab].filter((elm) => {
        if (searchEmojiValue === "") {
            return elm;
        }else if (elm?.description?.toLowerCase()?.includes(searchEmojiValue && searchEmojiValue?.toLowerCase())) {
            return elm;
        } 
    })
    
    return(<div className="customemojipicker">
        <div className="btngrouptbsemoji">
            <button 
                className={SelectEmojiTab === "Smileys_Emotion" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Smileys_Emotion")}
                style={{
                    backgroundImage: `url(${SmileImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Activities" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Activities")}
                style={{
                    backgroundImage: `url(${ActivitiesImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Animals_Nature" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Animals_Nature")}
                style={{
                    backgroundImage: `url(${AnimalNatureImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Flags" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Flags")}
                style={{
                    backgroundImage: `url(${FlagImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Food_Drink" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Food_Drink")}
                style={{
                    backgroundImage: `url(${FoodDriknsImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Objects" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Objects")}
                style={{
                    backgroundImage: `url(${ObjectsImage})`,
                }}
            ></button>
            <button 
                className={SelectEmojiTab === "Travel_Places" ? "btn btn-primary" :"btn"} 
                onClick={() => setSelectEmojiTab("Travel_Places")}
                style={{
                    backgroundImage: `url(${TravelImage})`,
                }}
            ></button>
        </div>
        <div className="searchBoxEmoji">
            <input 
                type="text" 
                value={searchEmojiValue}
                onChange={(e) => setSearchEmojiValue(e.target.value)}
                placeholder={"Search emoji in " + SelectEmojiTab.replace("_", " ").toLowerCase()} 
            />
        </div>
        <ul>
            {SearchEmojiArray.map((emoji, index) => {
                return(<li className="col-md-1" key={index} onClick={() =>selectEmoji(emoji)}>
                    <span className="emojiIconspicks">{emoji.emoji}</span>
                </li>)
            })}
            {SearchEmojiArray.length === 0 && (<div className="emptyImageswraps">
                <img src={NoEomji} alt="no emoji found" />
                <h4>No Emoji Found</h4>
            </div>)}
        </ul>
    </div>)
}

export default EmojiPicker;