import { DecimalPipe, DatePipe, CurrencyPipe, NgFor, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FinanceService } from '../finance/finance.service';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {PageEvent, MatPaginatorModule, MatPaginator} from '@angular/material/paginator';
import { ViewportScroller } from '@angular/common';

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexFill,
    ApexYAxis,
    ApexTooltip,
    ApexTitleSubtitle,
    ApexXAxis,
    ApexPlotOptions,
    ApexLegend,
  } from "ng-apexcharts";

  export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    title: ApexTitleSubtitle;
    labels: string[];
    stroke: any; // ApexStroke;
    dataLabels: any; // ApexDataLabels;
    fill: ApexFill;
    tooltip: ApexTooltip;
    plotOptions: ApexPlotOptions;
    legend: ApexLegend;
    colors: string[]
  };
    
@Component({
    selector       : 'analytics',
    templateUrl    : './analytics.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [MatButtonModule, MatPaginatorModule, MatIconModule, MatMenuModule, MatButtonToggleModule, NgApexchartsModule, MatTooltipModule, NgFor, DecimalPipe, MatTableModule, NgClass, CurrencyPipe, DatePipe, HttpClientModule ],
})
export class AnalyticsComponent implements OnInit, AfterViewInit, OnDestroy
{

    @ViewChild('paginator', { static: true }) paginator: MatPaginator;
    
    @ViewChild('recentTransactionsTable', {read: MatSort}) recentTransactionsTableMatSort: MatSort;

    chartVisitors: ApexOptions;
    chartConversions: ApexOptions;
    chartImpressions: ApexOptions;
    chartVisits: ApexOptions;
    chartVisitorsVsPageViews: ApexOptions;
    chartNewVsReturning: ApexOptions;
    chartGender: ApexOptions;
    chartAge: ApexOptions;
    chartLanguage: ApexOptions;
    data: any;
    data2: any;
    dataSQL : number[]=[];
    dataPython : number[]=[];
    dataR : number[]=[];
    dataSPark : number[]=[];
    dataML : number[]=[];
    dataNameTop : string[]=[];
    dataTop : number[]=[];
    dataTopPrevious : number[]=[];
    chartName : string = "Python";

    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['Skill', 'Occurence'];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    @ViewChild("chart", { static: false }) chart: ChartComponent;
    public chartOptions: Partial<ChartOptions>;

    /**
     * Constructor
     */
    constructor(
        private _analyticsService: AnalyticsService,
        private _router: Router,
        private _financeService: FinanceService,
        private http: HttpClient,
        private viewportScroller: ViewportScroller

        
    )
    {
        
       

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
         // Get the data May
         this._analyticsService.data2$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((data2) =>
         {
             // Store the data
             this.data2 = data2;

            let token = data2.access_token
            //console.log(token)
             // Store the table data
             //this.recentTransactionsDataSource.data = data2.recentTransactions;
            
             const headers = { 'Authorization': 'Bearer '+token, 'Accept': 'application/json' };
             //console.log(headers)
             const body = { 
             dataSource: 'Cluster0',
             database: 'Job',
             collection: 'May',
             filter:{},
             sort: {Occurence:-1} };
             this.http.post<any>('https://us-east4.gcp.data.mongodb-api.com/app/data-gtnau/endpoint/data/v1/action/find', body, { headers }).subscribe(data => {
                this.recentTransactionsDataSource.data = data["documents"]
             });
         });

         this._analyticsService.data2$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((data2) =>
         {
             // Store the data
             this.data2 = data2;

            let token = data2.access_token
            //console.log(token)
             // Store the table data
             //this.recentTransactionsDataSource.data = data2.recentTransactions;
            
             const headers = { 'Authorization': 'Bearer '+token, 'Accept': 'application/json' };
             //console.log(headers)
             const body = { 
             dataSource: 'Cluster0',
             database: 'Job',
             collection: 'Total',
             filter:{},
             sort: {Occurence:-1} };
             this.http.post<any>('https://us-east4.gcp.data.mongodb-api.com/app/data-gtnau/endpoint/data/v1/action/find', body, { headers }).subscribe(data => {
                //console.log(data["documents"][0]['SQL'])
                for(let i=0;i<12;i++){
                    this.dataSQL[i]=data["documents"][i]['SQL']
                    this.dataPython[i]=data["documents"][i]['PYTHON']
                    this.dataML[i]=data["documents"][i]['ML']
                    this.dataSPark[i]=data["documents"][i]['SPARK']
                    this.dataR[i]=data["documents"][i]['R']

                }
                //console.log(this.dataSQL)
                this.dataSQL=this.dataProcess(this.dataSQL)
                this.dataPython=this.dataProcess(this.dataPython)
                this.dataML=this.dataProcess(this.dataML)
                this.dataR=this.dataProcess(this.dataR)
                this.dataSPark=this.dataProcess(this.dataSPark)
                this.dataNameTop = ['Python','SQL','R','Spark','Machine Learning']
                this.dataTop = [this.dataPython[11],this.dataSQL[11],this.dataR[11],this.dataSPark[11],this.dataML[11]]
                //console.log(this.dataSQL)
                this._prepareChartData();

             });
         });


        // Get the data
        this._analyticsService.data$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((data) =>
            {
                // Store the data
                this.data = data;
                console.log(this.data.visitors.series)

                // Prepare the chart data
            });

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void =>
                    {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    ngAfterViewInit(): void
    {
        
        // Make the data source sortable
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
        this.recentTransactionsDataSource.paginator=this.paginator
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onClick(elementId: string): void { 
        this.viewportScroller.scrollToAnchor(elementId);
    }

    dataProcess(data:any):any
    {
        let tmp1 = data.slice(-6)
        let tmp2 = data.slice(0,6)
        let result = tmp1.concat(tmp2)
        return result
    }

    selectData(selector:any){
        console.log("select Data")
        let nameOption = ["Python","SQL","R","Machine Learning","Spark"]
        let dataOption = [this.dataPython,this.dataSQL,this.dataR,this.dataML,this.dataSPark]
        this.chartName = nameOption[selector]
        this.chartOptions.series = [
            {
            name: nameOption[selector],
            data: dataOption[selector],
            type: "column"
          },
          {
            name: nameOption[selector],
            data: dataOption[selector],
            type: "line"
          },
        ];
       
            
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void
    {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) =>
            {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

  
    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void
    {
  
     
          this.chartOptions = {
            colors     : ['#64748B', '#94A3B8'],

            series: [
              {
                name: "Python",
                type: "column",
                data: this.dataPython
              },
              {
                name: "Python",
                type: "line",
                data: this.dataPython
              }
            ],
            chart: {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'line',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            
            stroke: {
              width: [0, 4]
            },
           
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: [
              "July 2022",
              "Aug 2022",
              "Sep 2022",
              "Oct 2022",
              "Nov 2022",
              "Dec 2022",
              "Jan 2023",
              "Feb 2023",
              "Mar 2023",
              "Apr 2023",
              "May 2023",
              "June 2023",
            ],
            xaxis: {
              type: "datetime",
              axisTicks : {
                color: 'var(--fuse-border)',
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tooltip   : {
                    enabled: false,
                },
              
            },
            tooltip:{
                enabled: true,
                enabledOnSeries: [1],
                followCursor: true,
                theme       : 'dark',
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                },
            },
            legend     : {
                show: false,
            },

           
          };


        // Visitors vs Page Views
        this.chartVisitorsVsPageViews = {
            chart     : {
                animations: {
                    enabled: false,
                },
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '100%',
                type      : 'area',
                toolbar   : {
                    show: false,
                },
                zoom      : {
                    enabled: false,
                },
            },
            colors    : ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: false,
            },
            fill      : {
                colors : ['#64748B', '#94A3B8'],
                opacity: 0.5,
            },
            grid      : {
                show   : false,
                padding: {
                    bottom: -40,
                    left  : 0,
                    right : 0,
                },
            },
            legend    : {
                show: false,
            },
            series    : this.data.visitorsVsPageViews.series,
            stroke    : {
                curve: 'smooth',
                width: 2,
            },
            tooltip   : {
                followCursor: true,
                theme       : 'dark',
                x           : {
                    format: 'MMM dd, yyyy',
                },
            },
            xaxis     : {
                axisBorder: {
                    show: false,
                },
                labels    : {
                    offsetY: -20,
                    rotate : 0,
                    style  : {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                tickAmount: 3,
                tooltip   : {
                    enabled: false,
                },
                type      : 'datetime',
            },
            yaxis     : {
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)',
                    },
                },
                max       : (max): number => max + 250,
                min       : (min): number => min - 250,
                show      : false,
                tickAmount: 5,
            },
        };

    
    }
}
