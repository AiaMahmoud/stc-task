import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/core/services/alertify.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ChangeLanguageService } from 'src/app/core/services/change-language.service';
import { ProductsService } from 'src/app/services/api/products.service';
import { ConfirmMessageComponent } from 'src/app/shared/confirm-message/confirm-message.component';
import { ProductFormComponent } from '../products-form/product-form.component';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],

})
export class ProductsListComponent implements OnInit {
  params: any = {}
  page = 1
  size = 5
  loadingError = false
  loading = false
  oneEditModeOpen = false;
  headerDataList: any[] = []
  dataList: any[] = []
  displayColums: any[] = [
    'id', 'image', 'title', 'price', 'description', 'rating',  'actions'
  ]

  dataPaginationPerSize: any = [
    { value: 5 },
    { value: 20 },
    { value: 50 },
    { value: 100 },
    { value: 200 },
  ]
  totalCount!: number;
  totalPages!: number;
  arrTotalCount: number[] = [];
  constructor(
    private dialog: MatDialog,
    public languageService: ChangeLanguageService,
    private productsService: ProductsService,
    private alertify: AlertifyService,
    private auth: AuthenticationService,
    private translate: TranslateService,

  ) { 
    
  }
  allowCheckBox: boolean = false;
  donotHaveAccess: boolean = false;

  ngOnInit() {
    this.getProducts()
    this.loading = false
    this.loadingError = false
  }
  noDataMessageOn: boolean = false;

  getProducts() {
    this.loading = true;
    this.productsService.getProducts().subscribe((res: Array<Product>) => {
      if (res && res.length > 0) {
        this.dataList = res;
        this.setPaginationData(this.dataList);
      } else {
        this.noDataMessageOn = true;
      }
      this.loading = false
      this.loadingError = false
    }, error => {
      this.loadingError = true;
      if (error.status == 401) {
        this.alertify.error(this.translate.instant('error'));
        this.auth.logOutCallHandling()
      } else {
        this.alertify.error(this.translate.instant('error'));
      }
    })
  }
  searchAction($event: any) {
    let displayedList = [];
    if ($event.target.value && $event.target.value.length > 0) {
      this.dataList.forEach((element: any) => {
        if (
          element?.id?.toString().toLowerCase().includes($event.target.value.toLowerCase()) ||
          element?.title?.toLowerCase().includes($event.target.value.toLowerCase()) ||
          element?.price?.toString().toLowerCase().includes($event.target.value.toLowerCase()) ||
          element?.description?.toLowerCase().includes($event.target.value.toLowerCase()) ||
          element?.category?.toLowerCase().includes($event.target.value.toLowerCase())

        ) {
          displayedList.push(element);
        }
      });
    } else {
      displayedList = this.dataList;
    }
    this.setPaginationData(displayedList);
  }
  displayedList: any = [];

  setPaginationData(dataList: any) {
    let originalSize = dataList.length;
    let fromSize = (this.page - 1) * this.size;
    this.displayedList = dataList.slice(fromSize, (fromSize + this.size));
    const pages = originalSize / (this.size);
    this.arrTotalCount = [];
    for (let i = 0; i < pages; i++) {
      this.arrTotalCount.push(i + 1);
    }
  }

  selectedAgant: any;
  addNew() {
    var options ={
      width: '70%',
      height: '90%',
      position:{},
      backdropClass: 'backdropBackground',
    };
    let lang =localStorage.getItem('lang');

    if(lang =='ar'){
      options.position ={ left: '15%', top: '30px' };
    }else{
      options.position ={ right: '15%', top: '30px'};
    }
    const dialogRef = this.dialog.open(ProductFormComponent, options)
  }
  updateIndex(pageIndex: number) {
    this.page = pageIndex;
    this.setPaginationData(this.dataList);
  }

  closeSimpleModeEditeDataModel(e: any) {
    let lang =localStorage.getItem('lang');
    var options ={
      width: '70%',
      height: '90%',
      position:{},
      backdropClass: 'backdropBackground',
      data: e
    };
    if(lang =='ar'){
      options.position ={ left: '15%', top: '30px' };
    }else{
      options.position ={ right: '15%', top: '30px'};
    }
    const dialogRef = this.dialog.open(ProductFormComponent,
      options )
    dialogRef.afterClosed().subscribe((data: any) => {
      this.getProducts()
    })

  }
  closeSimpleModeSave(e: any) {
  }
  closeSimpleModeDelete(e: any) {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, {
      width: '50%',
      height: '75%',
      position: { right: '25%', top: '5%' },
      backdropClass: 'backdropBackground',
      data: { action: 'PRODUCTS.DeleteProduct', message: 'User' }
    })
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        this.productsService.deleteProduct(e?.id).subscribe((res) => {
          this.getProducts()
          this.alertify.success(this.translate.instant("deletedDone"));
        }, (error) => {
          this.alertify.error(error.error.message || this.translate.instant('error'));
        })
      }
    });
  }
  addForm() {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '800px',
      height: '90%',
    })
    dialogRef.afterClosed().subscribe((data: any) => {
      this.getProducts()
    })
  }
  handleChangePageSize(event: any) {
    this.size = event.target.value;
    this.page = 1
    this.getProducts()
  }


}


