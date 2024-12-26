import React, { ChangeEvent, forwardRef, KeyboardEvent } from 'react'
import './style.css';

interface Props{
  title: string;
  placeholder: string;
  type:'text' | 'password';
  value: string;
  isErrorMessage?: boolean;
  buttonTitle? : string;
  message?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onButtonClick?: () => void;
  disabled?: boolean;
  readOnly?: boolean; // readOnly 속성 추가
}

const InputBox = forwardRef<HTMLInputElement, Props>((props: Props, ref) => {

  const { title, placeholder, type, value, isErrorMessage, buttonTitle, message, onChange, onKeyDown, onButtonClick, disabled, readOnly} = props;

  // 해당 버튼 클래스가 
  // 값이 없다면? input-box-button-disable 
  // 값이 있다면? input-box-button
  // 3항 연산자 사용
  const buttonClass = value === ''? 'input-box-button-disable' : 'input-box-button';
  const messageClass = isErrorMessage ? 'input-box-message-error' : 'input-box-message';


  return (
    <div className='input-box'>
      <div className='input-box-title'>{title}</div>
      <div className='input-box-content'>
          <div className='input-box-body'>
            <input ref={ref} className='input-box-input' placeholder={placeholder} type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} disabled={disabled} readOnly={readOnly} aria-readonly={readOnly} />
            {buttonTitle !== undefined && onButtonClick !== undefined && <div className={buttonClass} onClick={onButtonClick}>{buttonTitle} </div>}
          </div>
          {message !== undefined && <div className={messageClass}>{message}</div>}
        
      </div>
    </div>
  );
});

export default InputBox;