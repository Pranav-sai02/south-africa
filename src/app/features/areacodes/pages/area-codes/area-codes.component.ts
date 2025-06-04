import { Component, OnInit } from '@angular/core';
import { ActiveToggleRendererComponent } from '../../../../shared/component/active-toggle-renderer/active-toggle-renderer.component';
import { SoftDeleteButtonRendererComponent } from '../../../../shared/component/soft-delete-button-renderer/soft-delete-button-renderer.component';
import { AreaCodes } from '../../models/AreaCodes';
import { ColDef, GetContextMenuItems, GetContextMenuItemsParams, ICellRendererParams } from 'ag-grid-community';
import { Store } from '@ngxs/store';
import { AddAreaCode, LoadAreaCodes, SoftDeleteAreaCode, UpdateAreaCode } from '../../state/area-code.actions';
import { AreaCodesState } from '../../state/area-code.state';


@Component({
  selector: 'app-area-codes',
  standalone: false,
  templateUrl: './area-codes.component.html',
  styleUrl: './area-codes.component.css',
})
export class AreaCodesComponent implements OnInit {
  
  ActiveToggleRendererComponent = ActiveToggleRendererComponent;
  SoftDeleteRendererComponent = SoftDeleteButtonRendererComponent;
  toggleOptions = false;

  rowData: AreaCodes[] = [];

  columnDefs: ColDef<AreaCodes>[] = [
    {
      field: 'AreaCode',
      headerName: 'Code',
      sortable: true,
      flex: 1,
      maxWidth: 150,
       editable: true,
       valueFormatter: (params) =>
        params.value ? params.value : 'Enter Areacode',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc', textAlign: 'center' },
      headerClass: 'bold-header',
    },
    {
      field: 'Description',
      headerName: 'Description',
      sortable: true,
      flex: 2,
      minWidth: 200,
       editable: true,
      valueFormatter: (params) =>
        params.value ? params.value : 'Enter Country/Region',
      cellClassRules: {
        'hint-text': (params) => !params.value,
      },
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },
    {
      field: 'Type',
      headerName: 'Type',
      sortable: true,
      flex: 1,
      minWidth: 180,
      cellStyle: { borderRight: '1px solid #ccc' },
      headerClass: 'bold-header',
    },

    {
      field: 'IsActive',
      headerName: 'Active',
      flex: 1,
      minWidth: 120,
      cellRenderer: 'activeToggleRenderer',

      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
    },
  

    {
      headerName: 'Delete',
      field: 'isDeleted',
      flex: 1,
      minWidth: 100,
      cellRenderer: 'softDeleteRenderer',
      cellStyle: {
        borderRight: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      headerClass: 'bold-header',
      onCellClicked: (params: any) => this.softDeleteProvider(params.data),
    },
  ];

  defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    
  };

  
 constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadAreaCodes());
    this.store.select(AreaCodesState.getAreaCodes).subscribe((data) => {
      console.log('From select:', data);
      this.rowData = data;
    });
  }

    

  onCellValueChanged(event: any): void {
    const updatedAreaCode: AreaCodes = event.data;
    this.store.dispatch(new UpdateAreaCode(updatedAreaCode));
  }

  softDeleteProvider(areaCode: AreaCodes): void {
    const updatedAreaCode = { ...areaCode, isDeleted: true };
    this.store.dispatch(new SoftDeleteAreaCode(updatedAreaCode));
  }
 
  


  addRow(): void {
    const newAreaCode:  AreaCodes = {
      AreaCodeId:0 ,
      AreaCode: '0',
      Description: '',
      Type: 'Landline',
      IsActive: true,
      isDeleted: false,
    };
    this.store.dispatch(new AddAreaCode(newAreaCode));
  }

  getContextMenuItems: GetContextMenuItems = (
    params: GetContextMenuItemsParams
  ) => {
    const addRow = {
      name: 'Add Row',
      action: () => this.addRow(),
      icon: '<i class="fas fa-plus"></i>',
    };

    const deleteRow = {
      name: 'Delete Row',
      action: () => {
        if (params.node) {
          this.softDeleteProvider(params.node.data);
        }
      },
      icon: '<i class="fas fa-trash"></i>',
    };

    return [addRow, deleteRow, 'separator', 'copy', 'export'];
  };
}
