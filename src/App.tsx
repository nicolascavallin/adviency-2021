import { FormEvent, FC, useState, useEffect, useRef } from "react";
import "./styles.css";
import Lottie from "react-lottie";
// @ts-ignore
import christmas from "./lottie/christmas";
// @ts-ignore
import santa from "./lottie/santa";

import { motion, AnimatePresence, useMotionValue } from "framer-motion";

interface Gift {
  gift: string;
  url: string;
  quantity: number;
}

const GiftComponent: FC<{
  onRemove: (index: number) => void;
  index: number;
  gift: Gift;
}> = ({ gift, index, onRemove }) => {
  const y = useMotionValue(0);
  return (
    <motion.div
      key={gift.gift}
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{ opacity: 0 }}
      className="gift-container"
      style={{ y }}
    >
      <div className="vertical-center">
        <img
          src={
            gift.url === ""
              ? "https://img.icons8.com/external-justicon-lineal-color-justicon/64/000000/external-gift-christmas-day-justicon-lineal-color-justicon.png"
              : gift.url
          }
          style={{
            width: "32px",
            height: "32px",
            objectFit: "cover"
          }}
        />
        <p
          style={{ display: "inline", marginLeft: "12px", marginRight: "12px" }}
        >
          {gift.gift}&nbsp;({gift.quantity.toString()})
        </p>
      </div>
      <button onClick={() => onRemove(index)}>X</button>
    </motion.div>
  );
};

export default function App() {
  //
  const formRef = useRef<HTMLFormElement>(null);
  const giftInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);

  const [flip, setFlip] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);

  const onRemove = (index: number) =>
    setGifts((data) => {
      const clone = [...data];
      clone.splice(index, 1);
      return [...clone];
    });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    const gift = e.target?.gift?.value?.trim() as string;
    // @ts-ignore
    const url = e.target?.url?.value?.trim() as string;
    // @ts-ignore
    const quantity = parseInt(e.target?.quantity?.value?.trim() as string);

    const exist = gifts.find(
      (x) => x.gift.toLowerCase() === gift.toLowerCase()
    );

    if (exist) return;

    if (gift.length > 0 && quantity > 0 && !exist) {
      setFlip(false);
      setGifts((data) => [...data, { gift, quantity, url }]);
      formRef.current?.reset();
      giftInputRef.current?.focus();
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (e.target.name === "gift") {
        e.preventDefault();
        // @ts-ignore
        const gift = e.target?.value?.trim() as string;
        const exist = gifts.find(
          (x) => x.gift.toLowerCase() === gift.toLowerCase()
        );

        if (exist) return;
        urlInputRef.current?.focus();
        return;
      }
      if (e.target.name === "url") {
        e.preventDefault();
        quantityInputRef.current?.focus();
        return;
      }
    }
  };

  useEffect(() => {
    if (flip) giftInputRef.current?.focus();
  }, [flip]);

  useEffect(() => {
    const store = localStorage.getItem("gifts");
    if (store) setGifts(JSON.parse(store));
  }, []);

  useEffect(() => {
    localStorage.setItem("gifts", JSON.stringify(gifts));
  }, [gifts]);

  return (
    <div className="App">
      <div className="container">
        <div
          className={flip ? "flip gift-box-container" : "gift-box-container"}
        >
          <div className="gift-box-front">
            <div
              style={{
                position: "relative",
                left: 0,
                top: -16,
                width: "100%",
                height: 120,
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: christmas,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice"
                  }
                }}
                style={{ position: "absolute", width: 120, left: 0 }}
              />
              <h1>Regalos</h1>
            </div>
            <button onClick={() => setFlip(true)}>Agregar regalo</button>
            <AnimatePresence>
              {gifts.map((g, i) => (
                <GiftComponent
                  key={g.gift}
                  gift={g}
                  index={i}
                  onRemove={onRemove}
                />
              ))}
            </AnimatePresence>
            {gifts.length ? (
              <button onClick={() => setGifts([])}>Borrar todo</button>
            ) : (
              <h3>No hay regalos, grinch.</h3>
            )}
          </div>
          <div className="gift-box-back">
            <div
              style={{
                position: "relative",
                left: 0,
                top: -16,
                width: "100%",
                height: 120,
                alignItems: "center",
                display: "flex",
                justifyContent: "flex-start"
              }}
            >
              <h1>Agregar regalo</h1>
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: santa,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice"
                  }
                }}
                style={{ position: "absolute", width: 120, right: 0 }}
              />
            </div>
            <form ref={formRef} onSubmit={onSubmit}>
              <div className="form">
                <input
                  ref={giftInputRef}
                  autoComplete="off"
                  name="gift"
                  autoFocus
                  placeholder="Regalo"
                  onKeyDown={onKeyDown}
                />
                <input
                  ref={urlInputRef}
                  autoComplete="off"
                  name="url"
                  placeholder="https://imagen.jpg"
                  onKeyDown={onKeyDown}
                />
                <input
                  ref={quantityInputRef}
                  name="quantity"
                  type="number"
                  min={1}
                  placeholder="Cant."
                />
                <button type="submit">Agregar</button>
                <button onClick={() => setFlip(false)}>Cerrar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
