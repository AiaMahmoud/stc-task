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
  selector: 'app-procuct-card-modal',
  templateUrl: './procuct-card-modal.component.html',
  styleUrls: ['./procuct-card-modal.component.scss']
})
export class ProductCardModalComponent implements OnInit {

  isSubmited = false;
  actionName: any
  userForm!: FormGroup;
  form = new FormGroup({});
  model: any = {};
  fields: FormlyFieldConfig[] = [];
  loading: boolean = true;

  constructor(
    private dialogRef: MatDialogRef<ProductCardModalComponent>,
    public languageService: ChangeLanguageService,
    private productsService: ProductsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public translate: TranslateService,
    private alertify: AlertifyService,
  ) {
  }
  ngOnInit() {
    this.lang = localStorage.getItem('lang')
  }

  disabelSubmit: boolean = false
  lang: any
  userData: any;

  addToCart(){
    this.data.selected = !this.data.selected;
  }
  closeModal() {
    this.dialogRef.close(false);
  }
}
