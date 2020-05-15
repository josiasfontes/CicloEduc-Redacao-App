import { Injectable } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';

@Injectable({
    providedIn: 'root'
})

export class MessageService {

    private defaultToast: any;

    constructor(private toast: Toast) {
        this.defaultToast = {
            message: '',
            duration: '3000',
            position: 'bottom'
        };
    }

    show(value) {
        var opts:any;

        if( typeof(value) == 'string') {
            opts = Object.assign(this.defaultToast, { message: value });
        }
        else {
            opts = Object.assign(this.defaultToast, value);
        }

        this.toast.show(opts.message, opts.duration, opts.position).subscribe(
            toast => {
                console.log(toast);
            }
        );
    }
}
