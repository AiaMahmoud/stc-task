import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertifyService } from 'src/app/core/services/alertify.service';
import { ChangeLanguageService } from 'src/app/core/services/change-language.service';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/api/products.service';

@Component({
  selector: 'app-products-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {

  isSubmited = false;
  actionName: any
  userForm!: FormGroup;
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  loading: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<ProductFormComponent>,
    public languageService: ChangeLanguageService,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: Product,
    public translate: TranslateService,
    private fb: FormBuilder,
    private alertify: AlertifyService,
  ) {
  }
  ngOnInit() {
    this.lang = localStorage.getItem('lang')
    if (this.data != null) {
      this.actionName = this.translate.instant('Update')
      this.getDataInfo()
    } else {
      this.actionName = this.translate.instant('Create')
    }
    this.drowDataFilds();
  }


  catigoriesList:any;
  drowDataFilds() {
    this.productsService.getAllCategories().subscribe((categories:any) => {
      this.catigoriesList = categories ?.map((v:string) => ({ value: v, name: v }));
      
      console.log('categories : ',categories);
      this.fields = [
        {
          key: 'title',
          type: 'input',
          className: 'col-md-12 px-formly',
          templateOptions: {
            label: `${this.translate.instant('PRODUCTS.title')} `,
            placeholder: this.translate.instant('PRODUCTS.enterProductTitle'),
            required: true,
            maxLength: 200
          },
          validation: {
            messages: {
              required: (error, field: FormlyFieldConfig) => this.translate.instant('required'),
            },
          },
        },
        {
          key: 'price',
          type: 'input',
          className: 'col-md-12 px-formly',
          templateOptions: {
            label: `${this.translate.instant('PRODUCTS.price')} `,
            placeholder: this.translate.instant('PRODUCTS.enterProductprice'),
            pattern: "[0-9]+(\\.[0-9][0-9]?)?",
            required: true,
            maxLength: 200
          },
          validation: {
            messages: {
              required: (error, field: FormlyFieldConfig) => this.translate.instant('required'),
              pattern: (error, field: FormlyFieldConfig) => this.translate.instant('pricePattern'),
            },
          },
        },
        {
          key: 'description',
          type: 'textarea',
          className: 'col-md-12 px-formly',
          templateOptions: {
            label: `${this.translate.instant('PRODUCTS.description')} `,
            placeholder: this.translate.instant('PRODUCTS.enterDescription'),
            required: true,
            rows: 3
          },
          validation: {
            messages: {
              required: (error, field: FormlyFieldConfig) => this.translate.instant('required'),
              pattern: (error, field: FormlyFieldConfig) => this.translate.instant('pricePattern'),
            },
          },
        },
        {
          key: 'image',
          type: 'input',
          className: 'col-md-12 px-formly',
          templateOptions: {
            label: `${this.translate.instant('PRODUCTS.imageURL')} `,
            placeholder: this.translate.instant('PRODUCTS.enterImageURL'),
            required: true,
            maxLength: 200
          },
          validation: {
            messages: {
              required: (error, field: FormlyFieldConfig) => this.translate.instant('required'),
            },
          },
        },
        {
          key: 'category',
          type: 'select',
          className: 'col-md-12 px-formly',
          templateOptions: {
            label: `${this.translate.instant('PRODUCTS.category')} `,
            placeholder: this.translate.instant('PRODUCTS.pleaseSelectCategory'),
            required: true,
            valueProp: 'name',
            labelProp: 'name',
            options: this.catigoriesList
          },
          validation: {
            messages: {
              required: (error, field: FormlyFieldConfig) => this.translate.instant('required'),
            },
          },
        }
      ];
    })
    this.loading = false;
    if (this.data != null) {

      this.model.title = this.data?.title;
      this.model.image = this.data?.image;
      this.model.price = this.data?.price;
      this.model.description = this.data?.description;
      this.model.category = this.data?.category;
      this.model.id = this.data?.id;
    }
  }
  disabelSubmit: boolean = false
  lang: any
  userData: any;
  getDataInfo() {
    this.form.patchValue({
      id: this.data?.id,
      title: this.data?.title,
      image: this.data?.image,
      category: this.data?.category,
      price: this.data?.price,
      description: this.data?.description
    });

  }

  onSubmit() {
    this.isSubmited = true
    let productData = {
      ...this.form.value
    }

    if (this.form.valid) {
      if (this.data != null && this.data.id) {
        productData.id = this.data.id;
        this.productsService.updateProduct(this.data.id, productData).subscribe((res) => {
          this.closeModal();
          if (res && res.id)
            this.alertify.success(this.translate.instant('product') +this.actionName +this.translate.instant('success') );
          else
            this.alertify.error(this.translate.instant('error'))
        }, (error) => {
          this.alertify.error(error.error.message || this.translate.instant('error'));
        })
      } else {
        this.productsService.createProduct(productData).subscribe((res) => {
          this.closeModal();
          if (res && res.id)
            this.alertify.success(this.translate.instant('product') +this.actionName +this.translate.instant('success'));
          else
            this.alertify.error(this.translate.instant('error'))
        }, (error) => {
          this.alertify.error(error.error.message || this.translate.instant('error'));
        })
      }
    }
  }
  onSelectValue(e: any) {
  }
  closeModal() {
    this.dialogRef.close(false);
  }
}
