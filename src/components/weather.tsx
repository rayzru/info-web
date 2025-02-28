import { type WeatherData } from "@sr2/lib/weather";
import { Card } from "./ui/card";
import {
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Cloudy,
  Droplet,
  MoonIcon,
  SunIcon,
  Wind,
} from "lucide-react";
import { DirectionArrow } from "./direction-arrow";

// Создаем Map с расшифровкой WMO кодов погоды на русском языке
const wmoWeatherCodes = new Map([
  [0, "Ясно"],
  [1, "Преимущественно ясно"],
  [2, "Переменная облачность"],
  [3, "Пасмурно"],
  [45, "Туман"],
  [48, "Туман с инеем"],
  [51, "Легкая морось"],
  [53, "Умеренная морось"],
  [55, "Сильная морось"],
  [56, "Легкая морось с замерзанием"],
  [57, "Сильная морось с замерзанием"],
  [61, "Небольшой дождь"],
  [63, "Умеренный дождь"],
  [65, "Сильный дождь"],
  [66, "Легкий замерзающий дождь"],
  [67, "Сильный замерзающий дождь"],
  [71, "Небольшой снегопад"],
  [73, "Умеренный снегопад"],
  [75, "Сильный снегопад"],
  [77, "Снежные зерна"],
  [80, "Небольшие ливни"],
  [81, "Умеренные ливни"],
  [82, "Сильные ливни"],
  [85, "Небольшой снегопад с ливнями"],
  [86, "Сильный снегопад с ливнями"],
  [95, "Гроза"],
  [96, "Гроза с небольшим градом"],
  [99, "Гроза с сильным градом"],
]);

export default function Weather(props: WeatherData) {
  const wmo = props.current.weatherCode;
  const isDay = props.current.isDay;

  return (
    <Card className="w-[300px] flex flex-col gap-4 p-4">
        <div className="flex flex-row items-center gap-2 ">
          <div>
            {wmo === 0 && (isDay ? <SunIcon /> : <MoonIcon />)}
            {wmo === 1 && (isDay ? <CloudSun /> : <CloudMoon />)}
            {wmo === 3 && <Cloudy />}
            {(wmo === 45 || wmo === 48) && <CloudFog />}
            {wmo >= 50 && wmo < 60 && <CloudDrizzle />}
            {wmo >= 60 && wmo < 70 && <CloudSnow />}
            {(wmo === 80 || wmo === 81 || wmo === 82) && <CloudRain />}
            {(wmo === 85 || wmo === 86) && <CloudHail />}
            {(wmo === 95 || wmo === 96 || wmo === 99) && <CloudLightning />}
          </div>
          <div className="font-extrabold tracking-tight">
            <span>{Math.floor(props.current.temperature2m)}</span>
            <span className="font-light">&deg;C</span>
          </div>
          <span>{wmoWeatherCodes.get(wmo)}</span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Wind className=" text-neutral-400" />
          <div className="text-nowrap flex flex-row items-center gap-2">
            Ветер
            <DirectionArrow
              degrees={props.current.windDirection10m}
              className="w-[12px] h-[12px]"
            />
            <span>{Math.round(props.current.windSpeed10m)}&nbsp;м/с</span>
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <Droplet className="text-neutral-400" />
          <div className="text-nowrap flex flex-row items-center gap-2">
            Влажность
            <span>{Math.round(props.current.relativeHumidity2m)}%</span>
          </div>
        </div>
    </Card>
  );
}
