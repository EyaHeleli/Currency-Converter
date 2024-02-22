import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConverterService {

  public exchangeRate: number = 1.1;

  constructor() { }

  public updateExchangeRate(): number{ 
   
      const randomValue= Math.random()*0.1-0.05;
      this.exchangeRate+=randomValue;
      return this.exchangeRate;
      
}
}