import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyConverterService } from './../currency-converter.service';
import { Subscription, interval, startWith, switchMap } from 'rxjs';
import { ConversionHistoryDto } from './../conversion-history.dto';

@Component({
  selector: 'app-currency-converter',
  templateUrl: './currency-converter.component.html',
  styleUrls: ['./currency-converter.component.css']
})

export class CurrencyConverterComponent implements OnInit, OnDestroy {
  
  timeInterval!:Subscription;
  exchangeRate!: number;
  amountEuro!:number;
  amountUSD!:number;
  isEuroSelected:boolean=true;
  fixedExchangeRate:number=0;
  displayMessage:boolean=false;
  conversionHistory:ConversionHistoryDto[]=[]


  constructor(private currencyService: CurrencyConverterService){}

  ngOnInit(): void {
    this.exchangeRate=this.currencyService.exchangeRate;
    this.timeInterval= interval(3000)
    .subscribe(()=>{this.updateExchangeRate()});   
  }

  public updateExchangeRate():void{
    this.exchangeRate=this.currencyService.updateExchangeRate();   
  }


  convert() {
    const rate = this.getEffectiveExchangeRate();
  
    if (this.isEuroSelected) {
      this.amountUSD = this.amountEuro * rate;
      this.addToHistory(rate,this.fixedExchangeRate,this.amountEuro,"EUR",this.amountUSD,"USD"); 
    } 
    else {
      this.amountEuro = this.amountUSD / rate;
      this.addToHistory(rate,this.fixedExchangeRate,this.amountUSD,"USD",this.amountEuro,"EUR"); 
    }
     
  }

  
  getEffectiveExchangeRate():number{
    const percentageDifference = Math.abs((this.fixedExchangeRate - this.exchangeRate) / this.exchangeRate) * 100;
    
    if (percentageDifference > 2) {
      this.fixedExchangeRate = 0; 
      this.displayMessage = true; 
      return this.exchangeRate; 
    }
     else {
      this.displayMessage = false;  
      return (percentageDifference > 2) ? this.exchangeRate : this.fixedExchangeRate; 
    }
  }

  toggleConversion() {
    this.isEuroSelected = !this.isEuroSelected;
  }

  addToHistory(realRate: number, selectedRate: number, initialValue: number, originalCurrency:string, convertedValue: number, convertedCurrency: string) {
    const newEntry: ConversionHistoryDto = {
      realRate,
      selectedRate,
      initialValue,
      originalCurrency,
      convertedValue,
      convertedCurrency
    };

    this.conversionHistory.unshift(newEntry); 
    if (this.conversionHistory.length > 5) {
      this.conversionHistory.pop(); 
    }
  }



  ngOnDestroy(): void {
      this.timeInterval.unsubscribe
  }

    

}
