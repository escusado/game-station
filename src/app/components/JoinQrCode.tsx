import { FC } from "react";
import QRCode from "react-qr-code";

type JoinQrCodeProps = {
  url: string;
};

const style = /*css*/ `
.qr-container{
  position: absolute;
  top: 10px;
  right: 10px;

  .body{
    padding-bottom: 10px;
    border: 4px solid #333;
    border-radius: 10px;
    background-color: #FFF;
    text-align: center;

    .label{
      padding: 10px;
      background-color: #333;
      font-family: "Joystix";
      font-size: 16px;
      font-weight: bold;
      color: #FFF;
      margin-bottom: 10px;
    }
  }

  .glow {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      color: #fff;
      background: #111;
      cursor: pointer;
      position: relative;
      z-index: 0;
      border-radius: 10px;
  }

  .glow:before {
      content: '';
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
      position: absolute;
      top: -2px;
      left:-2px;
      background-size: 400%;
      z-index: -1;
      filter: blur(5px);
      width: calc(100% + 4px);
      height: calc(100% + 4px);
      animation: glowing 20s linear infinite;
      transition: opacity .3s ease-in-out;
      border-radius: 10px;
  }

  .glow:after {
      z-index: -1;
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: #111;
      left: 0;
      top: 0;
      border-radius: 10px;
  }
}

@keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
}
`;

const JoinQrCode: FC<JoinQrCodeProps> = ({ url }) => {
  return (
    <>
      <style>{style}</style>
      <div className="qr-container">
        <div className="glow">
          <div className="body">
            <div className="label">Jump In! 🐸</div>
            <QRCode size={128} value={url} />
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinQrCode;
