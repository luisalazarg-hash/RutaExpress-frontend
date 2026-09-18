import React from 'react'

export const AboutUs = () => {
	return (
		<>
			<section className="py-5">
				<div className="container">
					<div className="row align-items-center gx-4">
						<div className="col-md-5">
							<div className="ms-md-2 ms-lg-5"><img className="img-fluid rounded-3" src="https://freefrontend.dev/assets/square.png" /></div>
						</div>
						<div className="col-md-6 offset-md-1">
							<div className="ms-md-2 ms-lg-5">
								<h2 className="display-5 fw-bold">Sobre <span className='text-danger'>Nosotros</span></h2>
								<p className="lead fw-b">En Ruta<span className='text-danger'>Express</span> hacemos que tus envíos sean más simples, rápidos y transparentes.<span className='text-danger'> Centralizamos</span> la gestión de pedidos y despachos para facilitar la coordinación, el seguimiento y la entrega de cada envío.</p>
								<p className="lead mb-0"><span className='text-danger'>Tu envío</span>, en buenas manos.</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
