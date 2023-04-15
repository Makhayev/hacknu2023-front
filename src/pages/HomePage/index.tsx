import React, { FC, useState } from "react";
import { YMaps, Map } from "react-yandex-maps";
import axios from "axios";
import { Input } from "antd";

export const HomePage: FC = () => {
  const [oblast, setOblast] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [flat, setFlat] = useState("");
  const [entrance, setEntrance] = useState("");
  const [floor, setFloor] = useState("");
  const [corpus, setCorpus] = useState("");
  const [nameOfBuilding, setNameOfBuilding] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const handleMapClick = (e: any): void => {
    const coords = e.get("coords");
    axios
      .get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=086d27be-6f48-4c9d-830b-b6652da76c52&geocode=${coords?.[1]},${coords?.[0]}&format=json`
      )
      .then((res) => {
        const responseObj =
          res.data.response.GeoObjectCollection.featureMember[0].GeoObject
            .metaDataProperty.GeocoderMetaData?.Address?.Components;
        responseObj.forEach((item: any) => {
          if (item.kind === "province") {
            setOblast(item.name);
          }
          if (item.kind === "locality") {
            setCity(item.name);
          }
          if (item.kind === "street") {
            setStreet(item.name);
          }
          if (item.kind === "house") {
            setHouseNumber(item.name);
          }
        });
      });
  };

  return (
    <div>
      <div>Hey</div>
      <div className="tw-flex tw-justify-between">
        <div className="tw-w-full">
          <YMaps>
            Hey
            <Map
              height="400px"
              width="100%"
              defaultState={{ center: [51.1605, 71.4704], zoom: 9 }}
              onClick={(e: any) => handleMapClick(e)}
            />
          </YMaps>
        </div>
        <div className="tw-w-full">
          <label>Область</label>
          <Input
            value={oblast}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setOblast(e.target.value)
            }
          />
          <label>Город</label>
          <Input
            value={city}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCity(e.target.value)
            }
          />
          <label>Улица</label>
          <Input
            value={street}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setStreet(e.target.value)
            }
          />
          <label>Номер дома</label>
          <Input
            value={houseNumber}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHouseNumber(e.target.value)
            }
          />
          <label>Квартира</label>
          <Input
            value={flat}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFlat(e.target.value)
            }
          />
          <label>Подъезд</label>
          <Input
            value={entrance}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEntrance(e.target.value)
            }
          />
          <label>Этаж</label>
          <Input
            value={floor}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFloor(e.target.value)
            }
          />
          <label>Корпус</label>
          <Input
            value={corpus}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCorpus(e.target.value)
            }
          />
          <label>Наименование ЖК</label>
          <Input
            value={nameOfBuilding}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNameOfBuilding(e.target.value)
            }
          />
          <label>Дополнительная информация</label>
          <Input
            value={additionalInfo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAdditionalInfo(e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};
