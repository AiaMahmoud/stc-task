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
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.scss'],

})
export class ProductsTableComponent implements OnInit {
  params: any = {}
  page = 1
  size = 100
  loadingError = false
  loading = false
  oneEditModeOpen = false;
  headerDataList: any[] = []
  dataList: any[] = []

  activeCategory:string = '';

  setStep(category: string) {
    this.dataList=[];
    this.activeCategory = category;
    this.getProducts();
  }

catigoriesList:Array<string>;

  dataPaginationPerSize: any = [
    { value: 8 },
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
    this.getCategories();
    this.getProducts()
    this.loading = false
    this.loadingError = false
  }
  noDataMessageOn: boolean = false;

  getCategories(){
    this.productsService.getAllCategories().subscribe((res: Array<string>) => {
      this.catigoriesList =res;
      this.activeCategory = this.catigoriesList[0];
    });
  }
  getProducts() {
    this.loading = true;
    this.productsService.getCategoryProducts(this.activeCategory).subscribe((res: Array<Product>) => {
      if (res && res.length > 0) {
        this.dataList = res;
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


