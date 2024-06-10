import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MedicosCrearService } from '../../../services/medicos-crear.service';

@Component({
  selector: 'app-medicos-crear',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './medicos-crear.component.html',
  styleUrls: ['./medicos-crear.component.css']
})
export class MedicosCrearComponent implements OnInit {

  public medico = {
    colegiado: '',
    nombre_completo: '',
    especialidad: '',
    fecha_registro: new Date(),
    direccion: '',
    centro_hospitalario: '',
    edad: '',
    observacion: ''
  };

  public errores = {
    colegiado: '',
    nombre_completo: '',
    especialidad: '',
    fecha_registro: '',
    direccion: '',
    centro_hospitalario: '',
    edad: '',
    observacion: ''
  };

  constructor(private medicoscrearService: MedicosCrearService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void { }

  formSubmit(form: NgForm) {
    this.errores = {
      colegiado: '',
      nombre_completo: '',
      especialidad: '',
      fecha_registro: '',
      direccion: '',
      centro_hospitalario: '',
      edad: '',
      observacion: ''
    };

    const nombrePattern = /^[a-zA-Z\s]+$/;
    const edadPattern = /^\d{1,2}$/;
    const colegiadoPattern = /^\d{1,9}$/;
    const fechaRegex = /^\d{2}-\d{2}-\d{4}$/;

    let formularioValido = true;

    if (!this.medico.colegiado || this.medico.colegiado.trim() === '') {
      this.errores.colegiado = 'El colegiado es requerido';
      formularioValido = false;
    } else if (!colegiadoPattern.test(this.medico.colegiado)) {
      this.errores.colegiado = 'El colegiado debe ser un número válido con un máximo de 9 dígitos';
      formularioValido = false;
    }

    if (!this.medico.nombre_completo || this.medico.nombre_completo.trim() === '') {
      this.errores.nombre_completo = 'El nombre del médico es requerido';
      formularioValido = false;
    } else if (!nombrePattern.test(this.medico.nombre_completo)) {
      this.errores.nombre_completo = 'El nombre no debe contener números';
      formularioValido = false;
    }

    if (!this.medico.especialidad || this.medico.especialidad.trim() === '') {
      this.errores.especialidad = 'La especialidad es requerida';
      formularioValido = false;
    }

    if (!this.medico.fecha_registro || this.medico.fecha_registro.toString().trim() === '') {
      this.errores.fecha_registro = 'La fecha de registro es requerida';
      formularioValido = false;
    } else {
      // Convertir la cadena de fecha a un objeto Date
      try {
        const dateParts = this.medico.fecha_registro.toString().split('/');
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript comienzan desde 0
        const day = parseInt(dateParts[0], 10);
        const date = new Date(year, month, day);

        // Asignar el objeto Date convertido de nuevo a la propiedad fecha_registro
        this.medico.fecha_registro = date;
      } catch (error) {
        this.errores.fecha_registro = 'El formato de la fecha debe ser día/mes/año (por ejemplo, 01/01/2024)';
        formularioValido = false;
      }
    }

    if (!this.medico.direccion || this.medico.direccion.trim() === '') {
      this.errores.direccion = 'La dirección es requerida';
      formularioValido = false;
    }

    if (!this.medico.centro_hospitalario || this.medico.centro_hospitalario.trim() === '') {
      this.errores.centro_hospitalario = 'El centro hospitalario es requerido';
      formularioValido = false;
    }

    if (!this.medico.edad || this.medico.edad.trim() === '') {
      this.errores.edad = 'La edad es requerida';
      formularioValido = false;
    } else if (!edadPattern.test(this.medico.edad)) {
      this.errores.edad = 'La edad debe ser un número válido con un máximo de 2 dígitos';
      formularioValido = false;
    }

    if (!this.medico.observacion || this.medico.observacion.trim() === '') {
      this.errores.observacion = 'La observación es requerida';
      formularioValido = false;
    }

    if (!formularioValido) {
      console.log('Errores en el formulario:', this.errores);
      return;
    }

    this.medicoscrearService.registrarMedico(this.medico).subscribe(
      (data) => {
        console.log(data);
        alert('El médico se ha almacenado de forma exitosa');
        this.router.navigate(['/show_medicos']);
      },
      (error) => {
        console.error('Error al enviar datos:', error);
        alert('Ha ocurrido un error en el sistema');
      }
    );
  }
}
